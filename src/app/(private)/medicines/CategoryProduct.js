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
import { useState } from "react";
import { useCreateCategoryMedicineMutation } from "@/stores/slices/api/category-medicine.slices.api";
import { toast } from "sonner";

export default function CategoryProduct() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [category, setCategory] = useState("");
  const [createCategory, { isLoading: loadingCreate }] =
    useCreateCategoryMedicineMutation();
  const handleSave = async (onClose) => {
    const dataCreate = { name: category };
    try {
      const resCreate = await createCategory(dataCreate).unwrap();
      if (resCreate.status === 201) {
        toast.success("Thêm thành công!");
        onClose();
      }
    } catch (error) {
      if (error.status === 403) {
        toast.error("Loại thuốc đã tồn tại!");
      }
    }
  };
  return (
    <>
      <Button className="mx-4" onPress={onOpen}>
        Thêm loại thuốc
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm loại thuốc mới
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Loại thuốc"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loadingCreate}
                  onPress={() => handleSave(onClose)}
                  isDisabled={!category}
                >
                  Thêm mới
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
