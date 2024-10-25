"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Table,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/SearchIcon";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { VerticalDotsIcon } from "@/components/VerticalDotsIcon";
import { columns } from "./configs/columns.configs";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import _ from "lodash";
import {
  useDeleteBookAppointmentMutation,
  useGetBookAppointmentsQuery,
  useUpdatedBookAppointmentsMutation,
} from "@/stores/slices/api/book-appointment.slices.api";
import { bookAppointmentStates } from "@/stores/slices/book-appointment.slices";
import { statusBookAppointments } from "./configs/status.configs";
import Result from "./Result";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useGetVoucherByCodeMutation } from "@/stores/slices/api/voucher.slices.api";
const URL_IMAGE =
  "http://res.cloudinary.com/daxftrleb/image/upload/v1720449738/heathcare/vvnd7igzkatjnw2hxkk4.png";

const BookAppointment = () => {
  const [type, setType] = useState("add");
  const [loading, setLoading] = useState(false);
  const [uploadedImageDoctor, setUploadedImageDoctor] = useState(null);
  const [uploadedImageUser, setUploadedImageUser] = useState(URL_IMAGE);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [keyword, setKeyword] = useState("");
  const { bookAppointments } = useSelector(bookAppointmentStates);
  const [file, setFile] = useState(null);
  const [currentBookAppointment, setCurrentBookAppointment] = useState(null);
  const [voucherAppointment, setVoucherAppointment] = useState(null);
  const [getVoucherByCode, { isLoading: loadingGetVoucherByCode }] =
    useGetVoucherByCodeMutation();

  async function handleGetVoucherByCode(appointment) {
    if (appointment?.voucher_code) {
      try {
        const response = await getVoucherByCode({
          userId: appointment?.user?.id,
          voucherCode: appointment?.voucher_code,
        }).unwrap();

        if (response) {
          setVoucherAppointment(response.data);
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
  }
  const [results, setResults] = useState("");
  useEffect(() => {
    setResults(
      currentBookAppointment?.results
        ? JSON.parse(currentBookAppointment?.results)
        : ""
    );
  }, [currentBookAppointment?.id]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const searchParams = useSearchParams();
  const queryParams = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  const debouncedFetchResults = useCallback(
    _.debounce((value) => {
      setKeyword(value);
    }, 500),
    []
  );
  const { data: bookAppointmentApiResponse } = useGetBookAppointmentsQuery(
    { ...queryParams, keyword, page, limit },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );
  const [updatedBookAppointment] = useUpdatedBookAppointmentsMutation();
  const [deleteBookAppointment] = useDeleteBookAppointmentMutation();
  const pages = Math.ceil(
    (bookAppointmentApiResponse?.data?.count || limit) / limit
  );
  useEffect(() => {
    if (currentBookAppointment) {
      setValue("nameDoctor", currentBookAppointment.doctor.name);
      setValue(
        "nameUser",
        currentBookAppointment.user.name || currentBookAppointment.user.email
      );
      setValue("status", currentBookAppointment.status);
      setUploadedImageDoctor(currentBookAppointment?.doctor?.image);
    }
  }, [currentBookAppointment, setValue]);
  useEffect(() => {
    if (isOpen === false) {
      setCurrentBookAppointment(null);
    }
  }, [isOpen]);
  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);
  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onSubmit = async (data) => {
    const dataUpdate = {
      status: data?.status || "pending",
      results: results ? JSON.stringify(results) : null,
      is_using_medicine: data?.is_using_medicine === "yes",
      start_using_medicine: startUsing || null,
      distance_using_medicine: data?.distance_using_medicine || null,
    };
    try {
      await updatedBookAppointment({
        id: currentBookAppointment?.id,
        body: dataUpdate,
      }).unwrap();
      toast.success("Cập nhật lịch khám thành công");
    } catch (e) {
      toast.error(e?.message || "lỗi server");
    }
    onOpenChange(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setUploadedImageDoctor(URL.createObjectURL(file));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleClose = () => {
    reset();
    setFile(null);
    setType("add");
    setVoucherAppointment(null);
    setUploadedImageDoctor(null);
    onOpenChange(false);
  };
  const handleEdit = useCallback(
    async (appointment) => {
      await handleGetVoucherByCode(appointment);
      setType("edit");
      setCurrentBookAppointment(appointment);
      setUploadedImageDoctor(appointment?.doctor?.image);
      onOpenChange(true);
    },
    [type]
  );
  const handleView = useCallback(
    (appointment) => {
      setType("view");
      setCurrentBookAppointment(appointment);
      setUploadedImageDoctor(appointment?.doctor?.image);
      onOpenChange(true);
    },
    [type]
  );
  const handleDeleteBookAppointment = async (appointment) => {
    try {
      await deleteBookAppointment({ id: appointment.id }).unwrap();
      toast.success("Xóa Lịch hẹn thành công");
    } catch (e) {
      console.log(e);
      toast.error(e?.data?.message || "Lỗi server");
    }
  };
  const handleChangeLimit = useCallback((e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  }, []);
  const onClear = () => {
    debouncedFetchResults("");
  };

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between w-full gap-3">
          <Input
            onChange={(e) => debouncedFetchResults(e.target.value)}
            className="w-full"
            placeholder="Tìm kiếm theo id, tên bác sĩ..."
            startContent={<SearchIcon />}
            onClear={() => onClear()}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-default-400 text-small">
            Tổng có : {bookAppointmentApiResponse?.data?.count || "đang xử lý"}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Hàng trên mỗi trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={handleChangeLimit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    ),
    [bookAppointments, handleChangeLimit]
  );

  const bottomContent = useMemo(
    () => (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400"></span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            onPress={onPreviousPage}
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
          >
            Trước
          </Button>
          <Button
            onPress={onNextPage}
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
          >
            Sau
          </Button>
        </div>
      </div>
    ),
    [page, limit, pages]
  );
  const handleStatus = (string) => {
    switch (string) {
      case "pending":
        return <Chip color="warning">Đang xử lý</Chip>;
      case "confirmed":
        return <Chip color="success">Đã xác nhận</Chip>;
      case "rejected":
        return <Chip color="danger">Từ chối</Chip>;
      default:
        return <Chip color="default">{string}</Chip>;
    }
  };

  const renderCell = useCallback((appointment, columnKey) => {
    const cellValue = appointment[columnKey];
    switch (columnKey) {
      case "doctor.name":
        return (
          <User
            avatarProps={{ radius: "lg", src: appointment?.doctor?.image }}
            name={cellValue || appointment?.doctor?.name}
          ></User>
        );
      case "user.name":
        return (
          <User
            avatarProps={{ radius: "lg", src: URL_IMAGE }}
            name={
              cellValue || appointment?.user?.name || appointment?.user?.email
            }
          ></User>
        );
      case "status":
        return handleStatus(cellValue);
      case "doctor.exp":
        return (
          <p className="capitalize text-bold text-small">{`${appointment?.doctor?.exp} năm`}</p>
        );
      case "startTime":
      case "endTime":
        return (
          <p className="capitalize text-bold text-small">
            {moment(cellValue).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleEdit(appointment)}>
                  Cập nhật
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDeleteBookAppointment(appointment)}
                >
                  Xóa
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const nowToday = today(getLocalTimeZone());

  const [startUsing, setStartUsing] = useState(null);
  useEffect(() => {
    setStartUsing(currentBookAppointment?.start_using_medicine);
  }, [currentBookAppointment?.id]);

  const contentModalBookAppointment = !loadingGetVoucherByCode && (
    <div>
      {voucherAppointment && (
        <div className="flex items-center gap-4 p-3 mb-5 border-2 border-pink-600 rounded-lg w-fit">
          <div className="font-bold">Voucher:</div>
          <div>
            <div className="flex">
              <div>{voucherAppointment?.name}</div>
              <div>({voucherAppointment?.voucher_code})</div>
            </div>
            <div>
              to:
              {moment(voucherAppointment?.expired_at).format("DD-MM-YYYY")}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-5">
        <div className="flex flex-1">
          <Input
            {...register("nameDoctor", {
              required: "Tên bác sĩ không được rỗng",
            })}
            isDisabled={type === "view" || type === "edit"}
            type="text"
            label="Tên bác sĩ"
            variant="bordered"
            placeholder="Nhập tên bác sĩ"
            error={errors.nameDoctor ? true : false}
          />
          {errors.nameDoctor && (
            <p className="p-2 text-sm text-red-500">
              {errors.nameDoctor.message}
            </p>
          )}
        </div>
        {uploadedImageDoctor ? (
          <Image
            className="rounded-[50%] w-[80px] h-[80px] object-cover"
            src={uploadedImageDoctor}
            alt="Uploaded"
            width="80"
            height="80"
          />
        ) : (
          <p></p>
        )}
      </div>

      <div className="flex items-center gap-5 mt-2 ">
        <div className="flex flex-1">
          <Input
            {...register("nameUser", {
              required: "Tên user không được rỗng",
            })}
            isDisabled={type === "view" || type === "edit"}
            type="text"
            label="Tên user"
            variant="bordered"
            placeholder="Nhập tên user"
            error={errors.nameUser ? true : false}
          />
          {errors.nameUser && (
            <p className="p-2 text-sm text-red-500">
              {errors.nameUser.message}
            </p>
          )}
        </div>
        {uploadedImageUser ? (
          <Image
            src={uploadedImageUser}
            alt="Uploaded"
            width={80}
            height={80}
          />
        ) : (
          <p></p>
        )}
      </div>

      <div className="flex items-center gap-5 mt-2">
        <Select
          {...register("status", {
            required: "Trạng thái không được rỗng",
          })}
          label="Trạng thái"
          isDisabled={type === "view"}
        >
          {statusBookAppointments.map((status) => (
            <SelectItem key={status.key}>{status.label}</SelectItem>
          ))}
        </Select>
        {errors?.status && (
          <p className="p-2 text-sm text-red-500">{errors?.status?.message}</p>
        )}
      </div>
      <div className="mt-4">
        <Result setResults={setResults} results={results} />
      </div>
    </div>
  );

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[582px]",
        }}
        selectionMode="multiple"
        topContent={topContent}
        topContentPlacement="outside"
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
        {bookAppointments && (
          <TableBody
            emptyContent={"Không có bác sĩ nào!"}
            items={bookAppointments}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
      <Modal isOpen={isOpen} onOpenChange={handleClose} size="full">
        <ModalContent className="book-appointment-modal-content">
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-1"
              >
                <ModalHeader>Lịch khám</ModalHeader>
                <ModalBody>{contentModalBookAppointment}</ModalBody>
                <ModalFooter>
                  <Button onPress={handleClose} color="danger" variant="light">
                    Thoát
                  </Button>
                  {type !== "view" && (
                    <Button type="submit" isLoading={loading} color="primary">
                      {type === "add" ? "Thêm" : "Cập nhật"}
                    </Button>
                  )}
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookAppointment;
