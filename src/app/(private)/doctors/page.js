"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
     Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input,
     Pagination, TableBody, TableCell, TableColumn, TableHeader, TableRow, Table,
     User,
     Modal,
     ModalContent,
     ModalHeader,
     ModalBody,
     ModalFooter,
     useDisclosure,
     Image,
     Select,
     SelectItem
} from '@nextui-org/react';
import { SearchIcon } from '@/components/SearchIcon';
import { ChevronDownIcon } from '@/components/ChevronDownIcon';
import { PlusIcon } from '@/components/PlusIcon';
import { useDispatch, useSelector } from 'react-redux';
import { doctorState, setDoctors } from '@/stores/slices/docotor.slices';
import { useAddDoctorMutation, useDeleteDoctorMutation, useGetDoctorsQuery, useUpdatedDoctorMutation } from '@/stores/slices/api/doctor.slices.api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';
import { VerticalDotsIcon } from '@/components/VerticalDotsIcon';
import { columns } from './configs/columns.configs';
import { formatVND } from './utils/formatVND';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useDropzone } from 'react-dropzone';
import { groupDoctors } from './configs/groupdoctor';
import { toast } from 'sonner';
import { useUploadImageMutation } from '@/stores/slices/api/upload.slices.api';
import _ from 'lodash';

const Doctor = () => {
     const [type, setType] = useState("add");
     const [loading, setLoading] = useState(false);
     const [uploadedImage, setUploadedImage] = useState(null);
     const { isOpen, onOpen, onOpenChange } = useDisclosure();
     const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
     const [keyword, setKeyword] = useState("");
     const { doctors } = useSelector(doctorState);
     const [file, setFile] = useState(null);
     const dispatch = useDispatch();
     const [currentDoctor, setCurrentDoctor] = useState(null);
     const [page, setPage] = useState(1);
     const [limit, setLimit] = useState(5);
     const searchParams = useSearchParams();
     const pathname = usePathname();
     const router = useRouter();
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
     const { data: doctorResponse } = useGetDoctorsQuery(
          { ...queryParams, keyword, page, limit },
          { refetchOnMountOrArgChange: true, refetchOnFocus: true }
     );
     const [uploadImage] = useUploadImageMutation();
     const [addDoctor] = useAddDoctorMutation();
     const [updatedDoctor] = useUpdatedDoctorMutation();
     const [deleteDoctor] = useDeleteDoctorMutation();
     const pages = Math.ceil((doctorResponse?.data?.count || limit) / limit);
     useEffect(() => {
          if (currentDoctor) {
               setValue('name', currentDoctor.name);
               setValue('address', currentDoctor.address);
               setValue('phone', currentDoctor.phone);
               setValue('exp', currentDoctor.exp);
               setValue('price', currentDoctor.price);
               setValue('doctor_group_id', currentDoctor.doctor_group_id);
               setUploadedImage(currentDoctor.image);
          }
     }, [currentDoctor, setValue]);
     useEffect(() => {
          if (isOpen === false) {
               setCurrentDoctor(null);
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
          try {
               setLoading(true);
               if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    const response = await uploadImage(formData).unwrap();
                    data.image = response.data;
               } else if (type === "edit") {
                    data.image = currentDoctor.image;
               } else {
                    toast.error("Vui lòng chọn ảnh");
                    setLoading(false);
                    return;
               }

               if (type === "add") {
                    await addDoctor(data).unwrap();
                    toast.success("Thêm bác sĩ thành công");
               } else {
                    await updatedDoctor({
                         id: currentDoctor?.id,
                         body: data

                    }).unwrap();
                    toast.success("Cập nhật bác sĩ thành công");
               }
               handleClose();
          } catch (error) {
               console.error('There was an error!', error);
               toast.error(error.message || "Lỗi máy chủ");
          } finally {
               setLoading(false);
          }



     };

     const onDrop = useCallback(acceptedFiles => {
          const file = acceptedFiles[0];
          setFile(file);
          setUploadedImage(URL.createObjectURL(file));
     }, []);
     const { getRootProps, getInputProps } = useDropzone({ onDrop });
     const handleClose = () => {
          reset();
          setFile(null);
          setType("add");
          setUploadedImage(null);
          onOpenChange(false);
     };
     const handleEdit = useCallback((doctor) => {
          setType("edit");
          setCurrentDoctor(doctor);
          setUploadedImage(doctor.image);
          onOpenChange(true);
     }, [type]);
     const handleView = useCallback((doctor) => {
          setType("view");
          setCurrentDoctor(doctor);
          setUploadedImage(doctor.image);
          onOpenChange(true);
     }, [type])
     const handleDeleteDoctor = async (doctor) => {
          try {
               await deleteDoctor({ id: doctor.id }).unwrap();
               toast.success("Xóa bác sĩ thành công");
          } catch (e) {
               toast.error(e?.message || "Lỗi server");
          }
     }
     const handleChangeLimit = useCallback((e) => {
          setLimit(Number(e.target.value));
          setPage(1);
     }, []);
     console.log("pages", pages)



     const topContent = useMemo(() => (
          <div className="flex flex-col gap-4">
               <div className="flex justify-between gap-3 items-end">
                    <Input
                         onChange={(e) => debouncedFetchResults(e.target.value)}
                         className="w-full sm:max-w-[44%]"
                         placeholder="Tìm kiếm theo id, tên bác sĩ..."
                         startContent={<SearchIcon />}
                         onClear={() => onClear()}
                    />
                    <div className="flex gap-3">
                         <Dropdown>
                              <DropdownTrigger className="hidden sm:flex">
                                   <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                        Ẩn/Hiện Cột
                                   </Button>
                              </DropdownTrigger>
                              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectionMode="multiple">
                                   {columns.map((column) => (
                                        <DropdownItem key={column.uid} className="capitalize">
                                             {capitalize(column.name)}
                                        </DropdownItem>
                                   ))}
                              </DropdownMenu>
                         </Dropdown>
                         <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
                              Thêm mới
                         </Button>
                    </div>
               </div>
               <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Tổng có :  {doctorResponse?.data?.count || "đang xử lý"}</span>
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
     ), [doctors, handleChangeLimit]);

     const bottomContent = useMemo(() => (
          <div className="py-2 px-2 flex justify-between items-center">
               <span className="w-[30%] text-small text-default-400">

               </span>
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
                    <Button onPress={onPreviousPage} isDisabled={pages === 1} size="sm" variant="flat">
                         Trước
                    </Button>
                    <Button onPress={onNextPage} isDisabled={pages === 1} size="sm" variant="flat" >
                         Sau
                    </Button>
               </div>
          </div>
     ), [page, limit, pages]);

     const renderCell = useCallback((user, columnKey) => {
          const cellValue = user[columnKey];
          console.log("columnKey,user", columnKey, user)
          switch (columnKey) {
               case "name":
                    return <User avatarProps={{ radius: "lg", src: user.image }} name={cellValue} ></User>;
               case "exp":
                    return <p className="text-bold text-small capitalize">{`${cellValue} năm`}</p>;
               case "price":
                    return <p className="text-bold text-small capitalize">{formatVND(cellValue)}</p>;
               case "created_at":
               case "updated_at":
                    return <p className="text-bold text-small capitalize">{moment(cellValue).utc().format('DD/MM/YYYY HH:mm:ss')}</p>;
               case "actions":
                    return (
                         <div className="relative flex justify-end items-center gap-2">
                              <Dropdown>
                                   <DropdownTrigger>
                                        <Button isIconOnly size="sm" variant="light">
                                             <VerticalDotsIcon className="text-default-300" />
                                        </Button>
                                   </DropdownTrigger>
                                   <DropdownMenu>
                                        <DropdownItem onClick={() => handleView(user)}>Xem chi tiết</DropdownItem>
                                        <DropdownItem onClick={() => handleEdit(user)}>Sửa</DropdownItem>
                                        <DropdownItem onClick={() => handleDeleteDoctor(user)}>Xóa</DropdownItem>
                                   </DropdownMenu>
                              </Dropdown>
                         </div>
                    );
               default:
                    return cellValue;
          }
     }, []);

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
                              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} >
                                   {column.name}
                              </TableColumn>
                         )}
                    </TableHeader>
                    {doctors && (
                         <TableBody emptyContent={"Không có bác sĩ nào!"} items={doctors}>
                              {(item) => (
                                   <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                   </TableRow>
                              )}
                         </TableBody>
                    )}
               </Table>
               <Modal isOpen={isOpen} onOpenChange={handleClose}>
                    <ModalContent className="custom-modal-content" >
                         {(onClose) => (
                              <>
                                   <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
                                        <ModalHeader>{type === "add" ? "Thêm" : (type === "edit" ? "Sửa" : "Xem chi tiết")} bác sĩ </ModalHeader>
                                        <ModalBody>
                                             <div className='grid grid-cols-2 gap-4'>
                                                  <div {...getRootProps()} className="col-span-2 flex items-center justify-center border-dashed border-2 border-gray-400 p-4 text-center m-h-[100px] rounded">
                                                       <input disabled={type === "view"} {...getInputProps()} />
                                                       {uploadedImage ? (
                                                            <Image isZoomed
                                                                 src={uploadedImage} alt="Uploaded" width={240}
                                                                 height={100} />
                                                       ) : (
                                                            <p>Chọn ảnh bác sĩ</p>
                                                       )}
                                                  </div>
                                                  <div>
                                                       <Input
                                                            {...register('name', { required: 'Tên bác sĩ  không được rỗng' })}
                                                            isDisabled={type === 'view'}
                                                            type="name"
                                                            label="Tên bác sĩ"
                                                            variant="bordered"
                                                            placeholder="Nhập tên bác sĩ"
                                                            className="max-w-xs"
                                                            error={errors.name ? true : false}
                                                       />
                                                       {errors.name && <p className='text-red-500 p-2 text-sm '>{errors.name.message}</p>}
                                                  </div>

                                                  <div>
                                                       <Input
                                                            {...register('address')}
                                                            type="address"
                                                            isDisabled={type === 'view'}
                                                            label="Địa chỉ"
                                                            variant="bordered"
                                                            placeholder="Nhập địa chỉ"
                                                            className="max-w-xs"
                                                       />
                                                  </div>

                                                  <div>
                                                       <Input
                                                            {...register('phone', {
                                                                 required: 'Số điện thoại là bắt buộc',
                                                                 pattern: {
                                                                      value: /^[0-9]+$/,
                                                                      message: 'Số điện thoại không hợp lệ, chỉ chứa số'
                                                                 },
                                                                 minLength: {
                                                                      value: 10,
                                                                      message: 'Số điện thoại phải có ít nhất 10 chữ số'
                                                                 },
                                                                 maxLength: {
                                                                      value: 11,
                                                                      message: 'Số điện thoại không được quá 11 chữ số'
                                                                 }
                                                            })}
                                                            isDisabled={type === 'view'}
                                                            label="Sđt"
                                                            variant="bordered"
                                                            placeholder="Nhập số điện thoại"
                                                            defaultValue=""
                                                            className="max-w-xs"
                                                       />
                                                       {errors.phone && <p className="text-red-500 p-2 text-sm">{errors.phone.message}</p>}
                                                  </div>

                                                  <div>
                                                       <Input
                                                            {...register('exp', {
                                                                 required: 'Số năm kinh nghiệm là bắt buộc',
                                                                 pattern: {
                                                                      value: /^[0-9]+$/,
                                                                      message: 'Số năm kinh nghiệm không hợp lệ, chỉ chứa số'
                                                                 },
                                                                 min: {
                                                                      value: 0,
                                                                      message: 'Số năm kinh nghiệm phải lớn hơn hoặc bằng 0'
                                                                 },
                                                                 max: {
                                                                      value: 50,
                                                                      message: 'Số năm kinh nghiệm phải nhỏ hơn hoặc bằng 50'
                                                                 }
                                                            })}
                                                            isDisabled={type === 'view'}
                                                            label="Kinh nghiệm"
                                                            variant="bordered"
                                                            placeholder="Nhập số năm kinh nghiệm"
                                                            defaultValue=""
                                                            className="max-w-xs"


                                                       />
                                                       {errors.exp && <p className="text-red-500 p-2 text-sm">{errors.exp.message}</p>}
                                                  </div>

                                                  <div>
                                                       <Input
                                                            {...register('price', {
                                                                 required: 'Giá khám là bắt buộc',
                                                                 pattern: {
                                                                      value: /^[0-9]+$/,
                                                                      message: 'Giá không hợp lệ, chỉ chứa số'
                                                                 },
                                                                 min: {
                                                                      value: 1,
                                                                      message: 'Giá phải lớn hơn 0'
                                                                 }
                                                            })}
                                                            isDisabled={type === 'view'}
                                                            label="Giá"
                                                            variant="bordered"
                                                            placeholder="Nhập giá khám (1h)"
                                                            defaultValue=""
                                                            className="max-w-xs"

                                                       />
                                                       {errors.price && <p className="text-red-500 p-2 text-sm">{errors.price.message}</p>}
                                                  </div>

                                                  <div>
                                                       <Select
                                                            {...register('doctor_group_id', { required: 'Nhóm bác sĩ không được rỗng' })}
                                                            label="Chọn nhóm bác sĩ"
                                                            isDisabled={type === 'view'}
                                                            className="max-w-xs"
                                                       >
                                                            {groupDoctors.map((groupDoctor) => (
                                                                 <SelectItem key={groupDoctor.key}>
                                                                      {groupDoctor.label}
                                                                 </SelectItem>
                                                            ))}
                                                       </Select>
                                                       {errors?.['doctor_group_id'] && <p className='text-red-500 p-2 text-sm '>{errors?.['doctor_group_id']?.message}</p>}
                                                  </div>
                                             </div>

                                        </ModalBody>
                                        <ModalFooter>
                                             <Button onPress={handleClose} color="danger" variant="light">
                                                  Thoát
                                             </Button>
                                             {
                                                  type !== "view" && (<Button type='submit' isLoading={loading} color="primary" >
                                                       {type === "add" ? "Thêm" : "Sửa"}
                                                  </Button>)
                                             }
                                        </ModalFooter>
                                   </form>
                              </>
                         )}
                    </ModalContent>
               </Modal>

          </>
     );
};

export default Doctor;
