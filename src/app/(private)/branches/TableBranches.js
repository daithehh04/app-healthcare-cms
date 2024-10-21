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
} from "@nextui-org/react";
import {
  useGetAllBranchesQuery,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
} from "@/stores/slices/api/branch.slice.api";
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
import { IoWarningOutline } from "react-icons/io5";
import _ from "lodash";
import { toast } from "sonner";
import Loading from "@/components/Loading";
export const SERVER_URL = process.env.SERVER_URL;

function TableBranches() {
  const queryInit = {
    page: 1,
    limit: 4,
  };
  const [branchDetail, setBranchDetail] = useState(null);
  const [branchDelete, setBranchDelete] = useState(null);
  const [branchClone, setDoctorGroupClone] = useState(null);
  const isChange = _.isEqual(branchClone, branchDetail);
  const [typeAction, setTypeAction] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [errors, setErrors] = useState({});
  const isError = _.some(errors, (value) => value !== null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [createBranch, { isLoading: loadingCreate }] =
    useCreateBranchMutation();
  const [updateBranch, { isLoading: loadingUpdate }] =
    useUpdateBranchMutation();
  const [deleteBranch, { isLoading: loadingDelete }] =
    useDeleteBranchMutation();

  const handleCheckCreate = () => {
    if (branchDetail) {
      if (Object.keys(branchDetail).length === 1 && !isError) {
        return true;
      }
    }
    return false;
  };
  const handleSave = async (onClose) => {
    try {
      setLoadingImg(true);
      const dataCreate = {
        ...branchDetail,
      };
      setBranchDetail(dataCreate);
      delete dataCreate.created_at;
      delete dataCreate.update_at;
      const resCreate = await createBranch(dataCreate).unwrap();
      if (resCreate.status === 201) {
        toast.success("Tạo chi nhánh thành công");
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImg(false);
    }
  };

  const handleUpdateBranch = async (onClose) => {
    try {
      setLoadingImg(true);
      const dataUpdate = {
        ...branchDetail,
      };
      delete dataUpdate.created_at;
      delete dataUpdate.update_at;
      setBranchDetail(dataUpdate);
      const resUpdate = await updateBranch(dataUpdate).unwrap();
      if (resUpdate.status === 200) {
        toast.success("Update branch success!");
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImg(false);
    }
  };

  const handleDeleteDoctorGroup = async (onClose) => {
    const resDelete = await deleteBranch(branchDelete.id).unwrap();
    if (resDelete.status === 200) {
      toast.success("Delete branch success!");
      onClose();
    }
  };
  const handleOpenDetail = (groupDoctor, type) => {
    setBranchDetail(groupDoctor);
    setDoctorGroupClone(groupDoctor);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleOpenModalAddNew = (type) => {
    setTypeAction(type);
    setErrors({});
    setBranchDetail(null);
    onOpen();
  };
  const handleOpenModalDelete = (groupDoctor, type) => {
    setBranchDelete(groupDoctor);
    setTypeAction(type);
    setErrors({});
    onOpen();
  };
  const handleChangeDoctorGroup = (field, value) => {
    console.log(field, value);
    validate(field, value);
    setBranchDetail({
      ...branchDetail,
      [field]: value,
    });
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllBranchesQuery(query);

  const renderCell = useCallback((branch, columnKey) => {
    const cellValue = branch[columnKey];

    switch (columnKey) {
      case "address":
        return <>{branch.address}</>;
      case "actions":
        return (
          <div className="relative flex items-end justify-center gap-4">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaRegEye onClick={() => handleOpenDetail(branch, "view")} />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaEdit onClick={() => handleOpenDetail(branch, "edit")} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <MdDelete
                  onClick={() => handleOpenModalDelete(branch, "delete")}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { name: "ADDRESS", uid: "address" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <Loading />;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allDoctorGroup = data?.data.branches;
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
    onClose();
  };

  const handleOpenChange = () => {
    onOpenChange();
  };

  const getBodyModal = () => {
    switch (typeAction) {
      case "view":
        return (
          <>
            <p>Địa chỉ: {branchDetail?.address}</p>
          </>
        );
      case "edit":
        return (
          <>
            <Input
              label="Address"
              isInvalid={errors?.["address"] ? true : false}
              errorMessage={errors?.["address"]}
              value={branchDetail?.address}
              onChange={(e) =>
                handleChangeDoctorGroup("address", e.target.value)
              }
            />
          </>
        );
      case "create":
        return (
          <>
            <Input
              label="Địa chỉ"
              isInvalid={errors?.["address"] ? true : false}
              errorMessage={errors?.["address"]}
              value={branchDetail?.address}
              onChange={(e) =>
                handleChangeDoctorGroup("address", e.target.value)
              }
            />
          </>
        );
      case "delete":
        return (
          <>
            <p>Bạn có chắc chắn muốn xóa chi nhánh này không?</p>
          </>
        );
      default:
        break;
    }
  };
  const getTitleModal = () => {
    switch (typeAction) {
      case "view":
        return <>Chi tiết chi nhánh</>;
      case "edit":
        return <>Chỉnh sửa chi nhánh</>;
      case "create":
        return <>Tạo mới chi nhánh</>;
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
        <TableBody items={allDoctorGroup || []}>
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
                    onPress={() => handleUpdateBranch(onClose)}
                    isDisabled={isChange || isError}
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

export default TableBranches;
