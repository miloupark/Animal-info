import { lazy, Suspense, useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

// lazy 함수에 import()를 반환하는 함수를 전달하면, 해당 경로의 컴포넌트를 지연 로딩한다.
const Main = lazy(() => import("./page/Main"));
const Detail = lazy(() => import("./page/Detail"));
const Search = lazy(() => import("./page/Search"));

function App() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <header>
        <h1>💚 동물 조아 💚</h1>
        <input
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            navigate(`/search?animal=${event.target.value}`);
          }}
        />
        <button onClick={() => navigate(`/search?animal=${inputValue}`)}>
          검색
        </button>
      </header>
      <Suspense fallback={<h1>로딩중...</h1>}>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/detail/:id" element={<Detail />}></Route>
          <Route path="/search" element={<Search />}></Route>
        </Routes>
      </Suspense>
      <footer>all rights reserved to OZ</footer>
    </>
  );
}

export default App;
