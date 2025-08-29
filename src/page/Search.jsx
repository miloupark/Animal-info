import { Link, useSearchParams } from "react-router-dom";
import { data } from "../assets/data/data";
import { getRegExp } from "korean-regexp";
import { useEffect, useRef, useState } from "react";

// 기존 방식
// function Search() {
//   const [searchParams] = useSearchParams();
//   const param = searchParams.get("animal");
//   const reg = getRegExp(param);

//   const filteredData = data.filter((el) => el.name.match(reg));

//   return (
//     <ul>
//       {filteredData.map((el) => (
//         <li key={el.id}>
//           <Link to={`/detail/${el.id}`}>
//             <img src={el.img} alt={el.name} />
//             <div>{el.name}</div>
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }

// debounce 적용 Search 컴포넌트
// function Search() {
//   const [searchParams] = useSearchParams();
//   // 화면에 표시할 데이터 상태 (초기값: 전체 data를 보여줌)
//   const [filteredData, setFilteredData] = useState(data);
//   // URL 쿼리스트링에서 animal 파라미터 추출
//   const param = searchParams.get("animal");

//   useEffect(() => {
//     // 검색어가 없으면 전체 데이터 표시
//     if (!param) {
//       setFilteredData(data);
//       return;
//     }

//     // 한글 초성/중성 검색을 위한 정규식 생성
//     const reg = getRegExp(param);

//     // debounce: 1초 대기 후 필터링 실행
//     // 사용자가 타이핑을 멈춘 후 1초 뒤에 검색이 실행된다.
//     const debounceTimer = setTimeout(() => {
//       // 정규식과 매칭되는 데이터만 필터링
//       const newFilteredData = data.filter((el) => el.name.match(reg));
//       setFilteredData(newFilteredData);
//     }, 1000);

//     // cleanup 함수: 컴포넌트 언마운트 또는 param 변경 시 실행
//     // 이전 타이머를 취소하여 불필요한 검색 방지
//     // 예: "강아" 입력 중 "강아지"로 바뀌면 "강아"의 타이머는 취소된다.
//     return () => clearTimeout(debounceTimer);
//   }, [param]);
//   // param이 변경될 때마다 effect 재실행

//   return (
//     <ul>
//       {filteredData.map((el) => (
//         <li key={el.id}>
//           <Link to={`/detail/${el.id}`}>
//             <img src={el.img} alt={el.name} />
//             <div>{el.name}</div>
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }

// throttle 적용 Search 컴포넌트
function Search() {
  const [searchParams] = useSearchParams();
  // 화면에 표시할 데이터 상태 (초기값: 전체 data를 보여줌)
  const [filteredData, setFilteredData] = useState(data);
  // URL 쿼리스트링에서 animal 파라미터 추출
  const param = searchParams.get("animal");

  // throttle 제어용 ref들
  const lastExecutedTime = useRef(0); // 마지막으로 실행된 시각 저장 (밀리초)
  const throttleTimer = useRef(null); // 예약된 setTimeout ID 저장

  useEffect(() => {
    // 검색어가 없으면 전체 데이터 표시
    if (!param) {
      setFilteredData(data);
      return;
    }

    // 한글 초성/중성 검색을 위한 정규식 생성
    const reg = getRegExp(param);

    // 현재 시각
    const now = Date.now();

    // 마지막 실행으로부터 경과한 시간
    const timeSinceLastExecution = now - lastExecutedTime.current;

    // 검색 실행 함수
    const executeSearch = () => {
      const newFilteredData = data.filter((el) => el.name.match(reg));
      setFilteredData(newFilteredData);
      lastExecutedTime.current = Date.now(); // 실행 시각 업데이트
    };

    // Throttle 로직
    if (timeSinceLastExecution >= 1000) {
      // Case 1: 마지막 실행으로부터 1초 이상 지났으면 즉시 실행
      executeSearch();
    } else {
      // Case 2: 1초가 안 지났으면 남은 시간만큼 대기 후 실행

      // 기존에 예약된 타이머가 있다면 취소 (최신 입력만 반영하기 위해)
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }

      // 아직 남아있는 시간 계산 (1초 - 경과 시간)
      const remainingTime = 1000 - timeSinceLastExecution;

      // 남은 시간이 지나면 실행 예약
      throttleTimer.current = setTimeout(() => {
        executeSearch();
        throttleTimer.current = null; // 타이머 초기화
      }, remainingTime);
    }
    // Cleanup: 다음 useEffect 실행 전 or 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [param]); // param이 바뀔 때마다 이 로직이 실행됨

  return (
    <ul>
      {filteredData.map((el) => (
        <li key={el.id}>
          <Link to={`/detail/${el.id}`}>
            <img src={el.img} alt={el.name} />
            <div>{el.name}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Search;
