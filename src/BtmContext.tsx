import React from "react";

type PostLoginParams = {
  username: string;
  password: String;
};

type Navigation = {
  name: string;
  current: boolean;
};

type Candidates = {
  id: number;
  name: string;
  job: string;
  description: string;
  image: string;
  category: string;
  categoryId: number;
};

type CandidatesParams = {
  name: string;
  job: string;
  description: string;
  image: string;
  category: number;
};

type Categories = {
  id: number;
  title: string;
};

type BtmValue = {
  postLogin: (params: PostLoginParams) => void;
  isLogin: boolean;
  isError: string;
  getCandidates: () => void;
  candidates: Candidates[];
  getCategories: () => void;
  categories: Categories[];
  logout: () => void;
  navigation: Navigation[];
  changeNavigation: (name: string) => void;
  postCandidate: (params: CandidatesParams) => void;
  deleteCandidate: (id: number) => void;
  editCandidate: (params: CandidatesParams, id: number) => void;
  addCategory: (title: string) => void;
  editCategory: (title: string, id: number) => void;
  deleteCategory: (id: number) => void;
};

const BtmContext = React.createContext<BtmValue>({
  postLogin: () => {},
  isLogin: false,
  isError: "",
  candidates: [],
  getCandidates: () => {},
  getCategories: () => {},
  categories: [],
  logout: () => {},
  navigation: [],
  changeNavigation: () => {},
  postCandidate: () => {},
  deleteCandidate: () => {},
  editCandidate: () => {},
  addCategory: () => {},
  editCategory: () => {},
  deleteCategory: () => {},
});

function useBtm(): BtmValue {
  const [state, setState] = React.useState<{
    isLogin: boolean;
    isError: string;
    candidates: Candidates[];
    categories: Categories[];
    navigation: Navigation[];
  }>({
    isLogin: false,
    isError: "",
    candidates: [],
    categories: [],
    navigation: [
      {
        name: "Candidates",
        current: true,
      },
      { name: "Categories", current: false },
    ],
  });

  const getCategories = async () => {
    try {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`);
      const response = await request.json();
      //@ts-ignore
      const datas = await response.map((data) => {
        return {
          id: data.id,
          title: data.title,
        };
      });
      setState((prevState) => ({
        ...prevState,
        categories: datas,
      }));
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getCandidates = async () => {
    try {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API}/candidates`);
      const response = await request.json();
      //@ts-ignore
      const datas = await response.map((data) => {
        return {
          id: data.id,
          name: data.name,
          job: data.job,
          description: data.description,
          category: data.category.title,
          image: data.imgUrl,
          categoryId: data.CategoryId,
        };
      });
      setState((prevState) => ({
        ...prevState,
        candidates: datas,
      }));

      return await datas;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const postLogin = async (params: PostLoginParams) => {
    try {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: params.username,
          password: params.password,
        }),
      });
      const response = await request.json();
      if (!request.ok) {
        throw response;
      }

      await localStorage.setItem(
        `${process.env.NEXT_PUBLIC_LOCALSTORAGE}`,
        response
      );
      await setState({ ...state, isLogin: true });
      await getCategories();
      await getCandidates();
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        setState({ ...state, isError: error });
        setTimeout(() => {
          setState({ ...state, isError: "" });
        }, 3000);
      }
    }
  };

  const logout = async () => {
    await localStorage.removeItem(`${process.env.NEXT_PUBLIC_LOCALSTORAGE}`);
    setState((prevState) => ({
      ...prevState,
      isLogin: false,
    }));
  };

  const changeNavigation = (name: string) => {
    const newNavigation = state.navigation.map((nav) => {
      if (nav.name === name) {
        return {
          name: nav.name,
          current: true,
        };
      } else {
        return {
          name: nav.name,
          current: false,
        };
      }
    });
    return setState((prevState) => ({
      ...prevState,
      navigation: newNavigation,
    }));
  };

  const postCandidate = async (params: CandidatesParams) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: params.name,
          job: params.job,
          description: params.description,
          imgUrl: params.image,
          CategoryId: params.category,
        }),
      });
      await getCandidates();
    } catch (error) {
      console.log(error, "error");
    }
  };

  const deleteCandidate = async (id: number) => {
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API}/candidates/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await getCandidates();
    } catch (error) {
      console.log(error, "error");
    }
  };

  const editCandidate = async (params: CandidatesParams, id: number) => {
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API}/candidates/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: params.name,
            job: params.job,
            description: params.description,
            imgUrl: params.image,
            CategoryId: params.category,
          }),
        }
      );
      await getCandidates();
    } catch (error) {
      console.log(error, "error");
    }
  };

  const addCategory = async (title: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });
      await getCategories();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const deleteCategory = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await getCategories();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const editCategory = async (title: string, id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });
      await getCategories();
    } catch (error) {
      console.log(error, "error");
    }
  };

  return {
    postLogin,
    isLogin: state.isLogin,
    isError: state.isError,
    candidates: state.candidates,
    getCandidates,
    getCategories,
    categories: state.categories,
    logout,
    navigation: state.navigation,
    changeNavigation,
    postCandidate,
    deleteCandidate,
    editCandidate,
    addCategory,
    editCategory,
    deleteCategory,
  };
}

export const useBtmContext = () => {
  return React.useContext(BtmContext);
};

export const BtmProvider = (props: { children: React.ReactNode }) => {
  const btmStore = useBtm();
  const { Provider } = BtmContext;
  return <Provider value={{ ...btmStore }}>{props.children}</Provider>;
};
