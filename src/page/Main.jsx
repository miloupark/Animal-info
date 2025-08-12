import { data } from "../assets/data/data";

function Main() {
  return (
    <ul>
      {data.map((el) => (
        <li key={el.id}>
          <img src={el.img} alt={el.name} />
          <div>{el.name}</div>
        </li>
      ))}
    </ul>
  );
}

export default Main;
