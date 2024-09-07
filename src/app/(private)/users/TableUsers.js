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
  User,
  Chip,
} from "@nextui-org/react";
import { useGetAllUsersQuery } from "@/stores/slices/api/user.slices.api";
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
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import { IoWarningOutline } from "react-icons/io5";
import _ from "lodash";
import { toast } from "sonner";
export const SERVER_URL = process.env.SERVER_URL;

function TableUsers() {
  const queryInit = {
    page: 1,
    limit: 2,
  };
  const [userDetail, setUserDetail] = useState(null);
  const [typeAction, setTypeAction] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleOpenDetail = (user, type) => {
    setUserDetail(user);
    setTypeAction(type);
    onOpen();
  };
  const statusColorMap = {
    active: "success",
    inactive: "danger",
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllUsersQuery(query);
  function checkAndPrint(text) {
    if (text.length > 64) {
      return text.substring(0, 64) + "...";
    }
    return text;
  }
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
          </div>
        );
      case "email":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-end justify-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <FaRegEye onClick={() => handleOpenDetail(user, "view")} />
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
    { name: "EMAIL", uid: "email" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <div>Loading...</div>;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allUsers = data?.data.users;
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
            <p>Name: {userDetail?.name}</p>
            <p>Email: {userDetail?.email}</p>
            <p>
              Trạng thái:{" "}
              {
                <Chip
                  className="capitalize"
                  color={statusColorMap[userDetail.status]}
                  size="sm"
                  variant="flat"
                >
                  {userDetail.status}
                </Chip>
              }
            </p>
          </>
        );
      default:
        break;
    }
  };
  const getTitleModal = () => {
    switch (typeAction) {
      case "view":
        return <>Chi tiết User</>;
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
        <TableBody items={allUsers}>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default TableUsers;
