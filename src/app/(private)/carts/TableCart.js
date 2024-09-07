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
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from "@/stores/slices/api/cart.slices.api";
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
import { MdDelete, MdOutlineDownloadDone } from "react-icons/md";
import Image from "next/image";
import { IoWarningOutline } from "react-icons/io5";
import _ from "lodash";
import { toast } from "sonner";
export const SERVER_URL = process.env.SERVER_URL;

function TableCart() {
  const queryInit = {
    page: 1,
    limit: 2,
  };
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderDelete, setOrderDelete] = useState(null);
  const [orderDone, setOrderDone] = useState(null);
  const [typeAction, setTypeAction] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
  const [updateOrder, { isLoading: loadingUpdate }] = useUpdateOrderMutation();
  const handleDeleteArticle = async (onClose) => {
    const resDelete = await deleteOrder(orderDelete.id).unwrap();
    if (resDelete.status === 200) {
      toast.success("Delete article success!");
      onClose();
    }
  };
  const handleOpenDetail = (order, type) => {
    setOrderDetail(order);
    setTypeAction(type);
    onOpen();
  };
  const handleOpenModalDelete = (order, type) => {
    setOrderDelete(order);
    setTypeAction(type);
    onOpen();
  };

  const handleOpenConfirm = (order, type) => {
    setTypeAction(type);
    setOrderDone(order);
    onOpen();
  };
  const statusColorMap = {
    done: "success",
    pending: "warning",
    confirm: "danger",
  };
  const [query, setQuery] = useState(queryInit);
  const { data, isLoading } = useGetAllOrdersQuery(query);
  function checkAndPrint(text) {
    if (text.length > 64) {
      return text.substring(0, 64) + "...";
    }
    return text;
  }
  const renderCell = useCallback((order, columnKey) => {
    const cellValue = order[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: order.image }}
            name={cellValue}
          >
            {order.name}
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
      case "quantity":
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
      case "total":
        return (
          <div className="flex flex-col">
            <p className="text-sm capitalize text-bold">
              {order.quantity * +order.new_price}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[order.status]}
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
                <FaRegEye onClick={() => handleOpenDetail(order, "view")} />
              </span>
            </Tooltip>
            {order.status !== "done" && (
              <Tooltip content="Mark as done">
                <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                  <MdOutlineDownloadDone
                    onClick={() => handleOpenConfirm(order, "markDone")}
                  />
                </span>
              </Tooltip>
            )}
            <Tooltip color="danger" content="Delete">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <MdDelete
                  onClick={() => handleOpenModalDelete(order, "delete")}
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
    { name: "DESCRIPTION", uid: "description" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "PRICE", uid: "new_price" },
    { name: "TOTAL", uid: "total" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (isLoading) return <div>Loading...</div>;
  const rowsPerPage = query.limit;
  const pages = Math.ceil(data?.data?.count / rowsPerPage);
  const allOrders = data?.data.carts;
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

  const handleMarkAsDone = async (onClose) => {
    const resUpdate = await updateOrder({
      idOrder: orderDone.id,
      payload: { status: "done" },
    }).unwrap();
    if (resUpdate.status === 200) {
      toast.success("Cập nhật thành công !");
      onClose();
    }
  };

  const getBodyModal = () => {
    switch (typeAction) {
      case "view":
        return (
          <>
            <Image
              width={240}
              height={240}
              src={orderDetail?.image}
              alt={orderDetail?.name}
              className="m-5"
            />
            <p>{orderDetail?.name}</p>
            <p>{orderDetail?.description}</p>
            <p>Quantity: {orderDetail?.quantity}</p>
            <p>Old price: {orderDetail?.old_price}</p>
            <p>New price: {orderDetail?.new_price}</p>
            <p>Name: {orderDetail?.user?.name}</p>
            <p>Email: {orderDetail?.user?.email}</p>
            <p>Total: {orderDetail?.quantity * +orderDetail?.new_price}</p>
            <p>
              Trạng thái:{" "}
              {
                <Chip
                  className="capitalize"
                  color={statusColorMap[orderDetail.status]}
                  size="sm"
                  variant="flat"
                >
                  {orderDetail.status}
                </Chip>
              }
            </p>
          </>
        );
      case "markDone":
        return (
          <>
            <p>Xác nhận hoàn thành order?</p>
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
        return <>Chi tiết order</>;
      case "markDone":
        return <>Confirm</>;
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
        <TableBody items={allOrders}>
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
        size={`${
          typeAction === "delete" || typeAction === "markDone" ? "lg" : "3xl"
        }`}
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
                {typeAction === "delete" && (
                  <Button
                    color="danger"
                    isLoading={loadingDelete}
                    onPress={() => handleDeleteArticle(onClose)}
                  >
                    Delete
                  </Button>
                )}
                {typeAction === "markDone" && (
                  <Button
                    color="primary"
                    isLoading={loadingUpdate}
                    onPress={() => handleMarkAsDone(onClose)}
                  >
                    Mark as Done
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

export default TableCart;
