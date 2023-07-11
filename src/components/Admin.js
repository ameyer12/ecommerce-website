import './admin.css';
import { Link } from 'react-router-dom';


function Admin({navigate}) {
  return (
    <div>
    <div className="dashboard">
        <h2>Admin Dashboard</h2>
        <div class="actions">
        <Link to="/addproduct">
            <button>Add Product</button>
        </Link>
        <Link to="/deleteproduct">
            <button>Delete Product</button>
        </Link>
        <Link to="/editproduct">
            <button>Edit Product</button>
        </Link>
        <Link to="/deleteuser">
            <button>Delete User</button>
        </Link>
        </div>
    </div>
    </div>
  );
}

export default Admin;