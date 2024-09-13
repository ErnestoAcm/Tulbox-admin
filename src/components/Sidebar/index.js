import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu);
  };
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      history("/login");
    }
  }, []);

  const logout = () => {
    localStorage.clear();

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Logout successfull",
    });

    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <NavLink exact activeClassName="is-active" to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(0)}
              >
                <span className="icon">
                  <MdDashboard />
                </span>
                Panel
              </Button>
            </NavLink>
          </li>
          <li>
            <Button
              className={`w-100 ${
                activeTab === 1 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Productos
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 1 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink exact activeClassName="is-active" to="/products">
                    Lista de productos
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/product/upload"
                  >
                    Carga de producto
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productRAMS/add"
                  >
                    Agregar RAMS de producto
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productWEIGHT/add"
                  >
                    Añadir PESO del producto
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/productSIZE/add"
                  >
                    Agregar producto TAMAÑO
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 2 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(2)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Categoría
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 2 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/category">Lista de categorías</Link>
                </li>
                <li>
                  <Link to="/category/add">Agregar una categoría</Link>
                </li>
                <li>
                  <Link to="/subCategory">Lista de subcategorías</Link>
                </li>
                <li>
                  <Link to="/subCategory/add">Agregar una subcategoría</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink exact activeClassName="is-active" to="/orders">
              <Button
                className={`w-100 ${
                  activeTab === 3 && isToggleSubmenu === true ? "active" : ""
                }`}
                onClick={() => isOpenSubmenu(3)}
              >
                <span className="icon">
                  {" "}
                  <FaClipboardCheck fontSize="small" />
                </span>
                Pedidos
              </Button>
            </NavLink>
          </li>

          <li>
            <Button
              className={`w-100 ${
                activeTab === 4 && isToggleSubmenu === true ? "active" : ""
              }`}
              onClick={() => isOpenSubmenu(4)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Banners de inicio
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${
                activeTab === 4 && isToggleSubmenu === true
                  ? "colapse"
                  : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/add"
                  >
                    Agregar banner de inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    activeClassName="is-active"
                    to="/homeBannerSlide/list"
                  >
                    Inicio de la lista de Banners
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <br />

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button variant="contained" onClick={logout}>
              <IoMdLogOut /> Cerrar sesion
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
