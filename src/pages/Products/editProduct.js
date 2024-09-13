import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useContext, useEffect, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import {
  deleteData,
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegImages } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

import { Link, useParams } from "react-router-dom";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import axios from "axios";
import CountryDropdown from "../../components/CountryDropdown";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUpload = () => {
  const [categoryVal, setcategoryVal] = useState("");
  const [subCatVal, setSubCatVal] = useState("");

  const [productRams, setProductRAMS] = useState([]);
  const [productWeight, setProductWeight] = useState([]);
  const [productSize, setProductSize] = useState([]);

  const [productRAMSData, setProductRAMSData] = useState([]);
  const [productWEIGHTData, setProductWEIGHTData] = useState([]);
  const [productSIZEData, setProductSIZEData] = useState([]);

  const [ratingsValue, setRatingValue] = useState(1);
  const [isFeaturedValue, setisFeaturedValue] = useState("");

  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [product, setProducts] = useState([]);

  const [previews, setPreviews] = useState([]);

  let { id } = useParams();

  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    name: "",
    subCat: "",
    subCatName: "",
    description: "",
    brand: "",
    price: null,
    oldPrice: null,
    catName: "",
    catId: "",
    subCatId: "",
    category: "",
    countInStock: null,
    rating: 0,
    isFeatured: null,
    discount: 0,
    productRam: [],
    size: [],
    productWeight: [],
    location: "",
  });

  const productImages = useRef();

  const context = useContext(MyContext);

  const formdata = new FormData();

  useEffect(() => {
    const subCatArr = [];

    context.catData?.categoryList?.length !== 0 &&
      context.catData?.categoryList?.map((cat, index) => {
        if (cat?.children.length !== 0) {
          cat?.children?.map((subCat) => {
            subCatArr.push(subCat);
          });
        }
      });

    setSubCatData(subCatArr);
  }, [context.catData]);

  useEffect(() => {
    window.scrollTo(0, 0);

    context.setselectedCountry("");

    setCatData(context.catData);

    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });

    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      console.log(res);
      setProducts(res);
      setFormFields({
        name: res.name,
        description: res.description,
        brand: res.brand,
        price: res.price,
        oldPrice: res.oldPrice,
        catName: res.catName,
        category: res.category,
        catId: res.catId,
        subCat: res.subCat,
        countInStock: res.countInStock,
        rating: res.rating,
        isFeatured: res.isFeatured,
        discount: res.discount,
        productRam: res.productRam,
        size: res.size,
        productWeight: res.productWeight,
        location: res.location,
      });

      context.setselectedCountry(res.location);

      setRatingValue(res.rating);
      console.log(res);
      setcategoryVal(res.category?._id);
      setSubCatVal(res.subCatId);
      setisFeaturedValue(res.isFeatured);
      setProductRAMS(res.productRam);
      setProductSize(res.size);
      setProductWeight(res.productWeight);
      setPreviews(res.images);
      context.setProgress(100);
    });

    fetchDataFromApi("/api/productWeight").then((res) => {
      setProductWEIGHTData(res);
    });
    fetchDataFromApi("/api/productRAMS").then((res) => {
      setProductRAMSData(res);
    });
    fetchDataFromApi("/api/productSIZE").then((res) => {
      setProductSIZEData(res);
    });
  }, []);

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      category: event.target.value,
    }));
  };

  const handleChangeSubCategory = (event) => {
    setSubCatVal(event.target.value);
    formFields.subCatId = event.target.value;
  };

  const checkSubCatName = (subCatName) => {
    formFields.subCatName = subCatName;
  };

  const handleChangeisFeaturedValue = (event) => {
    setisFeaturedValue(event.target.value);
    setFormFields(() => ({
      ...formFields,
      isFeatured: event.target.value,
    }));
  };

  const handleChangeProductRams = (event) => {
    // setProductRAMS(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     productRam: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductRAMS(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productRam = value;
  };

  const handleChangeProductWeight = (event) => {
    // setProductWeight(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     productWeight: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductWeight(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.productWeight = value;
  };

  const handleChangeProductSize = (event) => {
    // setProductSize(event.target.value);
    // setFormFields(() => ({
    //     ...formFields,
    //     size: event.target.value
    // }))

    const {
      target: { value },
    } = event;
    setProductSize(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    formFields.size = value;
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const selectCat = (cat, id) => {
    formFields.catName = cat;
    formFields.catId = id;
  };

  let img_arr = [];
  let uniqueArray = [];

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      setUploading(true);

      //const fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        // Validate file type
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];

          formdata.append(`images`, file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Por favor seleccione un archivo de imagen JPG o PNG válido.",
          });

          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }

    uploadImage(apiEndPoint, formdata).then((res) => {
      fetchDataFromApi("/api/imageUpload").then((response) => {
        if (
          response !== undefined &&
          response !== null &&
          response !== "" &&
          response.length !== 0
        ) {
          response.length !== 0 &&
            response.map((item) => {
              item?.images.length !== 0 &&
                item?.images?.map((img) => {
                  img_arr.push(img);

                  //console.log(img)
                });
            });

          uniqueArray = img_arr.filter(
            (item, index) => img_arr.indexOf(item) === index
          );

          const appendedArray = [...previews, ...uniqueArray];

          setPreviews(appendedArray);

          setTimeout(() => {
            setUploading(false);
            img_arr = [];
            context.setAlertBox({
              open: true,
              error: false,
              msg: "Imágenes subidas!",
            });
          }, 500);
        }
      });
    });
  };

  const removeImg = async (index, imgUrl) => {
    const imgIndex = previews.indexOf(imgUrl);

    deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Imagen eliminada!",
      });
    });

    if (imgIndex > -1) {
      // only splice array when item is found
      previews.splice(index, 1); // 2nd parameter means remove one item only
    }
  };

  useEffect(() => {
    formFields.location = context.selectedCountry;
  }, [context.selectedCountry]);

  const edit_Product = (e) => {
    e.preventDefault();

    const appendedArray = [...previews, ...uniqueArray];

    img_arr = [];

    formdata.append("name", formFields.name);
    formdata.append("description", formFields.description);
    formdata.append("brand", formFields.brand);
    formdata.append("price", formFields.price);
    formdata.append("oldPrice", formFields.oldPrice);
    formdata.append("catName", formFields.catName);
    formdata.append("catId", formFields.catId);
    formdata.append("subCatId", formFields.subCatId);
    formdata.append("category", formFields.category);
    formdata.append("subCat", formFields.subCat);
    formdata.append("countInStock", formFields.countInStock);
    formdata.append("rating", formFields.rating);
    formdata.append("isFeatured", formFields.isFeatured);
    formdata.append("discount", formFields.discount);
    formdata.append("productRam", formFields.productRam);
    formdata.append("size", formFields.size);
    formdata.append("productWeight", formFields.productWeight);
    formdata.append("location", formFields.location);

    formFields.images = appendedArray;

    if (formFields.name === "") {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue el nombre del producto",
        error: true,
      });
      return false;
    }

    if (formFields.description === "") {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue la descripción del producto",
        error: true,
      });
      return false;
    }

    if (formFields.brand === "") {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue la marca del producto",
        error: true,
      });
      return false;
    }

    if (formFields.price === null) {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue el precio del producto",
        error: true,
      });
      return false;
    }

    if (formFields.oldPrice === null) {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue el precio antiguo del producto",
        error: true,
      });
      return false;
    }

    if (formFields.category === "") {
      context.setAlertBox({
        open: true,
        msg: "por favor seleccione una categoría",
        error: true,
      });
      return false;
    }

    // if (formFields.subCat === "") {
    //     context.setAlertBox({
    //         open: true,
    //         msg: 'please select sub category',
    //         error: true
    //     })
    //     return false;
    // }

    if (formFields.countInStock === null) {
      context.setAlertBox({
        open: true,
        msg: "por favor agregue la cantidad de producto en stock",
        error: true,
      });
      return false;
    }

    if (formFields.rating === 0) {
      context.setAlertBox({
        open: true,
        msg: "por favor seleccione la calificación del producto",
        error: true,
      });
      return false;
    }

    if (formFields.isFeatured === null) {
      context.setAlertBox({
        open: true,
        msg: "por favor seleccione si el producto es destacado o no",
        error: true,
      });
      return false;
    }

    if (formFields.discount === null) {
      context.setAlertBox({
        open: true,
        msg: "por favor seleccione el descuento del producto",
        error: true,
      });
      return false;
    }

    if (previews.length === 0) {
      context.setAlertBox({
        open: true,
        msg: "por favor seleccione imágenes",
        error: true,
      });
      return false;
    }

    setIsLoading(true);

    editData(`/api/products/${id}`, formFields).then((res) => {
      context.setAlertBox({
        open: true,
        msg: "El producto ha sido actualizado!",
        error: false,
      });

      setIsLoading(false);
      deleteData("/api/imageUpload/deleteAllImages");

      history("/products");
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Edición de Producto</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Tablero"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb
              component="a"
              label="Productos"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
            <StyledBreadcrumb
              label="Edición de Producto"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>

        <form className="form" onSubmit={edit_Product}>
          <div className="row">
            <div className="col-md-12">
              <div className="card p-4 mt-0">
                <h5 className="mb-4">Información Básica</h5>

                <div className="form-group">
                  <h6>NOMBRE DEL PRODUCTO</h6>
                  <input
                    type="text"
                    name="name"
                    value={formFields.name}
                    onChange={inputChange}
                  />
                </div>

                <div className="form-group">
                  <h6>DESCRIPCIÓN</h6>
                  <textarea
                    rows={5}
                    cols={10}
                    value={formFields.description}
                    name="description"
                    onChange={inputChange}
                  />
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>CATEGORÍA</h6>

                      {categoryVal !== "" && (
                        <Select
                          value={categoryVal}
                          onChange={handleChangeCategory}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          className="w-100"
                        >
                          {context.catData?.categoryList?.length !== 0 &&
                            context.catData?.categoryList?.map((cat, index) => {
                              return (
                                <MenuItem
                                  className="text-capitalize"
                                  value={cat._id}
                                  key={index}
                                  onClick={() => selectCat(cat.name, cat._id)}
                                >
                                  {cat.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>SUBCATEGORÍA</h6>

                      <Select
                        value={subCatVal}
                        onChange={handleChangeSubCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        {subCatData?.length !== 0 &&
                          subCatData?.map((subCat, index) => {
                            return (
                              <MenuItem
                                className="text-capitalize"
                                value={subCat._id}
                                key={index}
                                onClick={() => checkSubCatName(subCat.name)}
                              >
                                {subCat.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>PRECIO</h6>
                      <input
                        type="text"
                        name="price"
                        value={formFields.price}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>PRECIO ANTIGUO </h6>
                      <input
                        type="text"
                        name="oldPrice"
                        value={formFields.oldPrice}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6 className="text-uppercase">es Destacado </h6>
                      <Select
                        value={isFeaturedValue}
                        onChange={handleChangeisFeaturedValue}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        <MenuItem value={true}>Verdadero</MenuItem>
                        <MenuItem value={false}>Falso</MenuItem>
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>STOCK DEL PRODUCTO </h6>
                      <input
                        type="text"
                        name="countInStock"
                        value={formFields.countInStock}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>MARCA</h6>
                      <input
                        type="text"
                        name="brand"
                        value={formFields.brand}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>DESCUENTO</h6>
                      <input
                        type="text"
                        name="discount"
                        value={formFields.discount}
                        onChange={inputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>MEMORIAS RAM DEL PRODUCTO</h6>
                      <Select
                        multiple
                        value={productRams}
                        onChange={handleChangeProductRams}
                        displayEmpty
                        className="w-100"
                        MenuProps={MenuProps}
                      >
                        {productRAMSData?.map((item, index) => {
                          return (
                            <MenuItem value={item.productRam}>
                              {item.productRam}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>PESO DEL PRODUCTO</h6>
                      <Select
                        multiple
                        value={productWeight}
                        onChange={handleChangeProductWeight}
                        displayEmpty
                        MenuProps={MenuProps}
                        className="w-100"
                      >
                        {productWEIGHTData?.map((item, index) => {
                          return (
                            <MenuItem value={item.productWeight}>
                              {item.productWeight}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>TAMAÑO DEL PRODUCTO</h6>
                      <Select
                        multiple
                        value={productSize}
                        onChange={handleChangeProductSize}
                        displayEmpty
                        MenuProps={MenuProps}
                        className="w-100"
                      >
                        {productSIZEData?.map((item, index) => {
                          return (
                            <MenuItem value={item.size}>{item.size}</MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>CALIFICACIONES</h6>
                      <Rating
                        name="simple-controlled"
                        value={ratingsValue}
                        onChange={(event, newValue) => {
                          setRatingValue(newValue);
                          setFormFields(() => ({
                            ...formFields,
                            rating: newValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <h6>UBICACIÓN</h6>

                      {context.countryList?.length !== 0 && (
                        <CountryDropdown
                          countryList={context.countryList}
                          selectedLocation={context.selectedCountry}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 mt-0">
            <div className="imagesUploadSec">
              <h5 class="mb-4">Medios y Publicado</h5>

              <div className="imgUploadBox d-flex align-items-center">
                {previews?.length !== 0 &&
                  previews?.map((img, index) => {
                    return (
                      <div className="uploadBox" key={index}>
                        <span
                          className="remove"
                          onClick={() => removeImg(index, img)}
                        >
                          <IoCloseSharp />
                        </span>
                        <div className="box">
                          <LazyLoadImage
                            alt={"image"}
                            effect="blur"
                            className="w-100"
                            src={img}
                          />
                        </div>
                      </div>
                    );
                  })}

                <div className="uploadBox">
                  {uploading === true ? (
                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                      <CircularProgress />
                      <span>Subiendo...</span>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={(e) =>
                          onChangeFile(e, "/api/category/upload")
                        }
                        name="images"
                      />
                      <div className="info">
                        <FaRegImages />
                        <h5>carga de imagen</h5>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <br />

              <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp;{" "}
                {isLoading === true ? (
                  <CircularProgress color="inherit" className="loader" />
                ) : (
                  "PUBLISH AND VIEW"
                )}{" "}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUpload;
