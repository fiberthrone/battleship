import { Link } from "react-router-dom";

function PageHome() {
  return (
    <div>
      <div>
        <Link to="/game/player1">Play as player #1</Link>
      </div>
      <div>
        <Link to="/game/player1">Play as player #2</Link>
      </div>
    </div>
  );
}

export default PageHome;
