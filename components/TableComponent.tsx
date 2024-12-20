"use client";
import { useState } from "react";
import { User } from "@/app/api/auth/sign-in/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";
import { DropdownAction } from "@/components/DropdownAction";
import { Checkbox } from "@/components/ui/checkbox";
import { invitedUser } from "@/lib/server/utils/authUtils";
import { Trash2 } from 'lucide-react';
export const TableComponent = ({
  header,
  dataColumn,
  data,
  isLoading,
  onDelete,
  onEdit,
  onView,
  onManyDelete,
  onResendInvite,
  tableType
}: {
  header: string[];
  dataColumn: string[];
  data: User[] | invitedUser[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onManyDelete?: (ids: string[]) => void;
  onResendInvite?: (id: string) => void;
  tableType?: string | null;
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const isSelected = (id: string) => checkedItems.indexOf(id) !== -1;
  const handleCheckboxClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    const isSelected = checkedItems.find((item) => item === id);
    console.log("isSelected : ", isSelected);
    if (isSelected) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };
  console.log("checked : ", checkedItems);
  const handleSelectAllClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.getAttribute("aria-checked") === "false") {
      const newSelecteds = data.map((user) => String(user?.id));
      setCheckedItems(newSelecteds);
    } else {
      setCheckedItems([]);
    }
  };
  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
  }
  const handleEdit = (id: string) => {
    if (onEdit) onEdit(id);
  }
  const handleView = (id: string) => {
    if (onView) onView(id);
  }

  const handleManyDelete = () => {
    if (onManyDelete) onManyDelete(checkedItems);
  }
  return (
    <section className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1">
              <Checkbox
                checked={checkedItems.length > 0}
                onClick={(event) => handleSelectAllClick(event)}
              />
            </TableHead>
            {header?.map((item, index) => {
              return <TableHead key={index}>{item}</TableHead>;
            })}
            <TableHead className="w-1" >
              {checkedItems.length > 0 && <Trash2 size={16} color="red" className="cursor-pointer" onClick={handleManyDelete} />}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={header.length + 2}
                className="h-[40vh] lg:h-[50vh] text-center"
              >
                <Loading />
              </TableCell>
            </TableRow>
          ) : !isLoading && data.length > 0 ? (
            data.map((user, index: number) => {
              const selected = isSelected(String(user?.id));
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onClick={(event) =>
                        handleCheckboxClick(event, String(user?.id))
                      }
                    />
                  </TableCell>
                  {dataColumn?.map((item, index) => {
                    return <TableCell key={index}>{(user as Record<string, string>)[item]}</TableCell>;
                  })}
                  <TableCell>
                    {(tableType == 'invitedUser' && (user as invitedUser)?.status !== 'accepted' && onResendInvite) ?
                      <DropdownAction
                        handleEdit={() => handleEdit(String(user?.id))}
                        handleDelete={() => handleDelete(String(user?.id))}
                        handleView={() => handleView(String(user?.id))}
                        handleResendInvite={() => onResendInvite(String(user?.id))}
                      />
                      :
                      <DropdownAction
                        handleEdit={() => handleEdit(String(user?.id))}
                        handleDelete={() => handleDelete(String(user?.id))}
                        handleView={() => handleView(String(user?.id))}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={header.length + 2}
                className="h-[40vh] lg:h-[50vh] text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};