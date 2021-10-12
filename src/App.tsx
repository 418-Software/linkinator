import "./App.css";
import { UTMGenerator } from "./components/UTMGenerator"
import ReactDOM from "react-dom";


function App(this: any) {
  return (
    <UTMGenerator />
  );
}

export default App;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
