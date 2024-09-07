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
  User,
} from "@nextui-org/react";
import {
  useGetAllArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from "@/stores/slices/api/article.slices.api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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

function TableArticles() {
  const queryInit = {
    page: 1,
    limit: 2,
  };
  const [articleDetail, setArticleDetail] = useState(null);
  const [articleDelete, setArticleDelete] = useState(null);
  const [articleClone, setArticleClone] = useState(null);
  const isChange = _.isEqual(articleClone, articleDetail);
  const [typeAction, setTypeAction] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const isError = _.some(errors, (value) => value !== null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createArticle, { isLoading: loadingCreate }] =
    useCreateArticleMutation();
  const [updateArticle, { isLoading: loadingUpdate }] =
    useUpdateArticleMutation();
  const [deleteArticle, { isLoading: loadingDelete }] =
    useDeleteArticleMutation();
  const handleCheckCreate = () => {
    if (articleDetail) {
      if (Object.keys(articleDetail).length === 3 && !isError && files.length) {
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
            ...articleDetail,
            image: urlImage,
          };
          setArticleDetail(dataCreate);
          delete dataCreate.created_at;
          delete dataCreate.update_at;
          const resCreate = await createArticle(dataCreate).unwrap();
          if (resCreate.status === 201) {
            toast.success("Tạo article thành công");
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

  const handleUpdateArticle = async (onClose) => {
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
            ...articleDetail,
            image: urlImage,
          };
          delete dataUpdate.created_at;
          delete dataUpdate.update_at;
          setArticleDetail(dataUpdate);
          const resUpdate = await updateArticle(dataUpdate).unwrap();
          if (resUpdate.status === 200) {
            toast.success("Update article success!");
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
        ...articleDetail,
      };
      delete dataUpdate.created_at;
      delete dataUpdate.update_at;
      const resUpdate = await updateArticle(articleDetail).unwrap();
      if (resUpdate.status === 200) {
        toast.success("Update article success!");
        onClose();
      }
    }
  };

  const handleDeleteArticle = async (onClose) => {
    const resDelete = await deleteArticle(articleDelete.id).unwrap();
    if (resDelete.status === 200) {
      toast.success("Delete article success!");
      onClose();
    }
  };
  const handleOpenDetail = (article, type) => {
    setArticleDetail(article);
    setArticleClone(article);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleOpenModalAddNew = (type) => {
    setTypeAction(type);
    setErrors({});
    setArticleDetail(null);
    onOpen();
  };
  const handleOpenModalDelete = (product, type) => {
    setArticleDelete(product);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleChangeArticle = (field, value) => {
    validate(field, value);
    setArticleDetail({
      ...articleDetail,
      [field]: value,
    });
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllArticlesQuery(query);
  function checkAndPrint(text) {
    if (text.length > 64) {
      return text.substring(0, 64) + "...";
    }
    return text;
  }
  const renderCell = useCallback((article, columnKey) => {
    const cellValue = article[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <User
            avatarProps={{ radius: "lg", src: article.image }}
            name={cellValue}
          >
            {article.title}
          </User>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">
              {checkAndPrint(cellValue)}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-end justify-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaRegEye onClick={() => handleOpenDetail(article, "view")} />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaEdit onClick={() => handleOpenDetail(article, "edit")} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <MdDelete
                  onClick={() => handleOpenModalDelete(article, "delete")}
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
    { name: "TITLE", uid: "title" },
    { name: "DESCRIPTION", uid: "description" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <div>Loading...</div>;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allArticles = data?.data.articles;
  const validate = (field, value) => {
    const error = {};
    if (!value) {
      error[field] = "Not be empty!";
    } else {
      error[field] = null;
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
              src={articleDetail?.image}
              alt={articleDetail?.title}
              className="m-5"
            />
            <p>{articleDetail?.title}</p>
            <p>{articleDetail?.description}</p>
            <p>{articleDetail?.content}</p>
          </>
        );
      case "edit":
        return (
          <>
            <UploadImage
              info={articleDetail.image}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Tiêu đề"
              isInvalid={errors?.["title"] ? true : false}
              errorMessage={errors?.["title"]}
              value={articleDetail?.title}
              onChange={(e) => handleChangeArticle("title", e.target.value)}
            />
            <Textarea
              label="Mô tả"
              isInvalid={errors?.["description"] ? true : false}
              errorMessage={errors?.["description"]}
              value={articleDetail?.description}
              onChange={(e) =>
                handleChangeArticle("description", e.target.value)
              }
            />
            <Textarea
              label="Nội dung"
              isInvalid={errors?.["content"] ? true : false}
              errorMessage={errors?.["content"]}
              value={articleDetail?.content}
              onChange={(e) => handleChangeArticle("content", e.target.value)}
            />
          </>
        );
      case "create":
        return (
          <>
            <UploadImage
              info={articleDetail}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Tiêu đề"
              isInvalid={errors?.["title"] ? true : false}
              errorMessage={errors?.["title"]}
              value={articleDetail?.title}
              onChange={(e) => handleChangeArticle("title", e.target.value)}
            />
            <Textarea
              label="Mô tả"
              isInvalid={errors?.["description"] ? true : false}
              errorMessage={errors?.["description"]}
              value={articleDetail?.description}
              onChange={(e) =>
                handleChangeArticle("description", e.target.value)
              }
            />
            <Textarea
              label="Nội dung"
              isInvalid={errors?.["content"] ? true : false}
              errorMessage={errors?.["content"]}
              value={articleDetail?.content}
              onChange={(e) => handleChangeArticle("content", e.target.value)}
            />
          </>
        );
      case "delete":
        return (
          <>
            <p>Bạn có chắc chắn muốn xóa article này không?</p>
          </>
        );
      default:
        break;
    }
  };
  const getTitleModal = () => {
    switch (typeAction) {
      case "view":
        return <>Chi tiết article</>;
      case "edit":
        return <>Chỉnh sửa article</>;
      case "create":
        return <>Tạo mới article</>;
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
        <TableBody items={allArticles}>
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
        size={`${typeAction === "delete" ? "lg" : "3xl"}`}
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
                    onPress={() => handleUpdateArticle(onClose)}
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
                    onPress={() => handleDeleteArticle(onClose)}
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

export default TableArticles;
