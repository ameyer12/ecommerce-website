import "./navbar.css";
import logo from "./media/Ecommerce.png"

function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="/"><img src={logo} width="60" height="60" alt="logo"/></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/products">Shop</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/login"><i className="material-icons">person</i></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/cart"><i className="material-icons">shopping_cart</i></a>
                </li>
                </ul>
            </div>
        </nav>
    );
}
  
export default Navbar;
  