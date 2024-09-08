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
  User,
} from "@nextui-org/react";
import {
  useGetAllDoctorGroupQuery,
  useCreateDoctorGroupMutation,
  useUpdateDoctorGroupMutation,
  useDeleteDoctorGroupMutation,
} from "@/stores/slices/api/doctor-group.slices.api";
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
import Loading from "@/components/Loading";
export const SERVER_URL = process.env.SERVER_URL;

function TableDoctorGroup() {
  const queryInit = {
    page: 1,
    limit: 2,
  };
  const [doctorGroupDetail, setDoctorGroupDetail] = useState(null);
  const [doctorGroupDelete, setDoctorGroupDelete] = useState(null);
  const [doctorGroupClone, setDoctorGroupClone] = useState(null);
  const isChange = _.isEqual(doctorGroupClone, doctorGroupDetail);
  const [typeAction, setTypeAction] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const isError = _.some(errors, (value) => value !== null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createDoctorGroup, { isLoading: loadingCreate }] =
    useCreateDoctorGroupMutation();
  const [updateDoctorGroup, { isLoading: loadingUpdate }] =
    useUpdateDoctorGroupMutation();
  const [deleteDoctorGroup, { isLoading: loadingDelete }] =
    useDeleteDoctorGroupMutation();
  const handleCheckCreate = () => {
    if (doctorGroupDetail) {
      if (
        Object.keys(doctorGroupDetail).length === 1 &&
        !isError &&
        files.length
      ) {
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
            ...doctorGroupDetail,
            image: urlImage,
          };
          setDoctorGroupDetail(dataCreate);
          delete dataCreate.created_at;
          delete dataCreate.update_at;
          const resCreate = await createDoctorGroup(dataCreate).unwrap();
          if (resCreate.status === 201) {
            toast.success("Tạo group doctor thành công");
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

  const handleUpdateDoctorGroup = async (onClose) => {
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
            ...doctorGroupDetail,
            image: urlImage,
          };
          delete dataUpdate.created_at;
          delete dataUpdate.update_at;
          setDoctorGroupDetail(dataUpdate);
          const resUpdate = await updateDoctorGroup(dataUpdate).unwrap();
          if (resUpdate.status === 200) {
            toast.success("Update group doctor success!");
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
        ...doctorGroupDetail,
      };
      delete dataUpdate.created_at;
      delete dataUpdate.update_at;
      const resUpdate = await updateDoctorGroup(doctorGroupDetail).unwrap();
      if (resUpdate.status === 200) {
        toast.success("Update group doctor success!");
        onClose();
      }
    }
  };

  const handleDeleteDoctorGroup = async (onClose) => {
    const resDelete = await deleteDoctorGroup(doctorGroupDelete.id).unwrap();
    if (resDelete.status === 200) {
      toast.success("Delete group doctor success!");
      onClose();
    }
  };
  const handleOpenDetail = (groupDoctor, type) => {
    setDoctorGroupDetail(groupDoctor);
    setDoctorGroupClone(groupDoctor);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleOpenModalAddNew = (type) => {
    setTypeAction(type);
    setErrors({});
    setDoctorGroupDetail(null);
    onOpen();
  };
  const handleOpenModalDelete = (groupDoctor, type) => {
    setDoctorGroupDelete(groupDoctor);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleChangeArticle = (field, value) => {
    validate(field, value);
    setDoctorGroupDetail({
      ...doctorGroupDetail,
      [field]: value,
    });
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllDoctorGroupQuery(query);

  const renderCell = useCallback((doctorGroup, columnKey) => {
    const cellValue = doctorGroup[columnKey];

    switch (columnKey) {
      case "name":
        return <>{doctorGroup.name}</>;
      case "image":
        return <User avatarProps={{ radius: "lg", src: doctorGroup.image }} />;
      case "actions":
        return (
          <div className="relative flex items-end justify-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaRegEye
                  onClick={() => handleOpenDetail(doctorGroup, "view")}
                />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaEdit onClick={() => handleOpenDetail(doctorGroup, "edit")} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <MdDelete
                  onClick={() => handleOpenModalDelete(doctorGroup, "delete")}
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
    { name: "IMAGE", uid: "image" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <Loading />;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allDoctorGroup = data?.data.doctorGroups;
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
              src={doctorGroupDetail?.image}
              alt={doctorGroupDetail?.name}
              className="m-5"
            />
            <p>Name: {doctorGroupDetail?.name}</p>
          </>
        );
      case "edit":
        return (
          <>
            <UploadImage
              info={doctorGroupDetail.image}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Name"
              isInvalid={errors?.["name"] ? true : false}
              errorMessage={errors?.["name"]}
              value={doctorGroupDetail?.name}
              onChange={(e) => ("name", e.target.value)}
            />
          </>
        );
      case "create":
        return (
          <>
            <UploadImage
              info={doctorGroupDetail}
              onFiles={setFiles}
              files={files}
            />
            <Input
              label="Tiêu đề"
              isInvalid={errors?.["name"] ? true : false}
              errorMessage={errors?.["name"]}
              value={doctorGroupDetail?.title}
              onChange={(e) => handleChangeArticle("title", e.target.value)}
            />
          </>
        );
      case "delete":
        return (
          <>
            <p>Bạn có chắc chắn muốn xóa group doctor này không?</p>
          </>
        );
      default:
        break;
    }
  };
  const getTitleModal = () => {
    switch (typeAction) {
      case "view":
        return <>Chi tiết group doctor</>;
      case "edit":
        return <>Chỉnh sửa group doctor</>;
      case "create":
        return <>Tạo mới group doctor</>;
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
        <TableBody items={allDoctorGroup}>
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
                    onPress={() => handleUpdateDoctorGroup(onClose)}
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
                    onPress={() => handleDeleteDoctorGroup(onClose)}
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

export default TableDoctorGroup;
