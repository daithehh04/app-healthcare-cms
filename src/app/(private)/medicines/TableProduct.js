"use client";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/stores/slices/api/product.slices.api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import Image from "next/image";
import UploadImage from "../components/UploadImage";
import { IoWarningOutline } from "react-icons/io5";
import _ from "lodash";
import { toast } from "sonner";
export const SERVER_URL = process.env.SERVER_URL;

function TableProduct() {
  const queryInit = {
    page: 1,
    limit: 2,
  };
  const [productDetail, setProductDetail] = useState(null);
  const [productDelete, setProductDelete] = useState(null);
  const [productClone, setProductClone] = useState(null);
  const isChange = _.isEqual(productClone, productDetail);
  const [typeAction, setTypeAction] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const isError = _.some(errors, (value) => value !== null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const handleCheckCreate = () => {
    if (productDetail) {
      if (Object.keys(productDetail).length === 4 && !isError && files.length) {
        return true;
      }
    }
    return false;
  };
  const handleSave = async (onClose) => {
    if (files?.length) {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      try {
        setLoadingImg(true);
        const res = await fetch(`${SERVER_URL}image`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
        if (res.success) {
          const urlImage = res.data;
          const dataCreate = {
            ...productDetail,
            image: urlImage,
          };
          setProductDetail(dataCreate);
          const resCreate = await createProduct(dataCreate).unwrap();
          if (resCreate.status === 201) {
            toast.success("Tạo sản phẩm thành công");
            onClose();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingImg(false);
      }
    }
  };

  const handleUpdateProduct = async (onClose) => {
    if (files?.length) {
      const formData = new FormData();
      files.forEach((file) => formData.append("image", file));
      try {
        setLoadingImg(true);
        const res = await fetch(`${SERVER_URL}image`, {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
        if (res.success) {
          const urlImage = res.data;
          const dataUpdate = {
            ...productDetail,
            image: urlImage,
          };
          delete dataUpdate.created_at;
          delete dataUpdate.update_at;
          setProductDetail(dataUpdate);
          const resUpdate = await updateProduct(dataUpdate).unwrap();
          if (resUpdate.status === 200) {
            toast.success("Update product success!");
            onClose();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingImg(false);
      }
    } else {
      const dataUpdate = {
        ...productDetail,
      };
      delete dataUpdate.created_at;
      delete dataUpdate.update_at;
      const resUpdate = await updateProduct(productDetail).unwrap();
      if (resUpdate.status === 200) {
        toast.success("Update product success!");
        onClose();
      }
    }
  };

  const handleDeleteProduct = async (onClose) => {
    const resDelete = await deleteProduct(productDelete.id).unwrap();
    if (resDelete.status === 200) {
      toast.success("Delete product success!");
      onClose();
    }
  };
  const handleOpenDetail = (product, type) => {
    setProductDetail(product);
    setProductClone(product);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleOpenModalAddNew = (type) => {
    setTypeAction(type);
    setErrors({});
    setProductDetail(null);
    onOpen();
  };
  const handleOpenModalDelete = (product, type) => {
    setProductDelete(product);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleChangeProduct = (field, value) => {
    validate(field, value);
    setProductDetail({
      ...productDetail,
      [field]: value,
    });
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllProductsQuery(query);
  function checkAndPrint(text) {
    if (text.length > 64) {
      return text.substring(0, 64) + "...";
    }
    return text;
  }
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: product.image }}
            description={checkAndPrint(product.description)}
            name={cellValue}
          >
            {product.name}
          </User>
        );
      case "old_price":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
          </div>
        );
      case "new_price":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-end justify-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaRegEye onClick={() => handleOpenDetail(product, "view")} />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaEdit onClick={() => handleOpenDetail(product, "edit")} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <MdDelete
                  onClick={() => handleOpenModalDelete(product, "delete")}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "OLD PRICE", uid: "old_price" },
    { name: "NEW PRICE", uid: "new_price" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <div>Loading...</div>;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allProducts = data?.data.medicines;
  const validate = (field, value) => {
    const error = {};
    if (!value) {
      error[field] = "Not be empty!";
    } else {
      error[field] = null;
      if (field === "new_price" || field === "old_price") {
        const regexNumber = /^[0-9]*$/;
        if (regexNumber.test(value)) {
          error[field] = null;
        } else {
          error[field] = "Please enter a number value!";
        }
      }
    }
    setErrors({
      ...errors,
      ...error,
    });
  };
  const handleChangePagination = (page) => {
    setQuery({
      ...query,
      page,
    });
  };

  const handleCloseModal = (onClose) => {
    setFiles([]);
    onClose();
  };

  const handleOpenChange = () => {
    onOpenChange();
    setFiles([]);
  };

  const getBodyModal = () => {
    switch (typeAction) {
      case "view":
        return (
          <>
            <Image
              width={240}
              height={240}
              src={productDetail?.image}
              alt={productDetail?.name}
              className="m-5"
            />
            <p>{productDetail?.name}</p>
            <p>{productDetail?.description}</p>
            <p>Old Price: {productDetail?.old_price}</p>
            <p>New Price: {productDetail?.new_price}</p>
          </>
        );
      case "edit":
        return (
          <>
            <UploadImage
              info={productDetail.image}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Tên thuốc"
              isInvalid={errors?.["name"] ? true : false}
              errorMessage={errors?.["name"]}
              value={productDetail?.name}
              onChange={(e) => handleChangeProduct("name", e.target.value)}
            />
            <Textarea
              label="Mô tả"
              isInvalid={errors?.["description"] ? true : false}
              errorMessage={errors?.["description"]}
              value={productDetail?.description}
              onChange={(e) =>
                handleChangeProduct("description", e.target.value)
              }
            />
            <Input
              label="Giá cũ"
              value={productDetail?.old_price}
              isInvalid={errors?.["old_price"] ? true : false}
              errorMessage={errors?.["old_price"]}
              onChange={(e) => handleChangeProduct("old_price", e.target.value)}
            />
            <Input
              label="Giá mới"
              isInvalid={errors?.["new_price"] ? true : false}
              errorMessage={errors?.["new_price"]}
              value={productDetail?.new_price}
              onChange={(e) => handleChangeProduct("new_price", e.target.value)}
            />
          </>
        );
      case "create":
        return (
          <>
            <UploadImage
              info={productDetail}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Tên thuốc"
              isInvalid={errors?.["name"] ? true : false}
              errorMessage={errors?.["name"]}
              value={productDetail?.name}
              onChange={(e) => handleChangeProduct("name", e.target.value)}
            />
            <Textarea
              label="Mô tả"
              isInvalid={errors?.["description"] ? true : false}
              errorMessage={errors?.["description"]}
              value={productDetail?.description}
              onChange={(e) =>
                handleChangeProduct("description", e.target.value)
              }
            />
            <Input
              label="Giá cũ"
              value={productDetail?.old_price}
              isInvalid={errors?.["old_price"] ? true : false}
              errorMessage={errors?.["old_price"]}
              onChange={(e) => handleChangeProduct("old_price", e.target.value)}
            />
            <Input
              label="Giá mới"
              isInvalid={errors?.["new_price"] ? true : false}
              errorMessage={errors?.["new_price"]}
              value={productDetail?.new_price}
              onChange={(e) => handleChangeProduct("new_price", e.target.value)}
            />
          </>
        );
      case "delete":
        return (
          <>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
          </>
        );
      default:
        break;
    }
  };
  const getTitleModal = () => {
    switch (typeAction) {
      case "view":
        return <>Chi tiết sản phẩm</>;
      case "edit":
        return <>Chỉnh sửa sản phẩm</>;
      case "create":
        return <>Tạo mới sản phẩm</>;
      case "delete":
        return (
          <div className="flex items-start gap-2">
            <IoWarningOutline fontSize={"1.4rem"} /> Xác nhận
          </div>
        );
      default:
        break;
    }
  };

  return (
    <>
      <Button
        color="primary"
        className="mb-4"
        onClick={() => handleOpenModalAddNew("create")}
      >
        Tạo mới <IoMdAddCircleOutline fontSize={"1.2rem"} />
      </Button>
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          pages > 0 ? (
            <div className="flex justify-center w-full">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={query.page}
                total={pages}
                onChange={(page) => handleChangePagination(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={allProducts}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        size={`${typeAction === "delete" ? "lg" : "2xl"}`}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        shouldBlockScroll
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {getTitleModal()}
              </ModalHeader>
              <ModalBody>{getBodyModal()}</ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleCloseModal(onClose)}
                >
                  Close
                </Button>
                {typeAction === "edit" && (
                  <Button
                    color="primary"
                    isLoading={loadingImg || loadingUpdate}
                    onPress={() => handleUpdateProduct(onClose)}
                    isDisabled={(isChange || isError) && !files.length}
                  >
                    Update
                  </Button>
                )}
                {typeAction === "create" && (
                  <Button
                    color="primary"
                    onPress={() => handleSave(onClose)}
                    isLoading={loadingImg || loadingCreate}
                    isDisabled={!handleCheckCreate()}
                  >
                    Create
                  </Button>
                )}
                {typeAction === "delete" && (
                  <Button
                    color="danger"
                    isLoading={loadingDelete}
                    onPress={() => handleDeleteProduct(onClose)}
                  >
                    Delete
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TableProduct;
