// src/components/JobsPagination.tsx

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex  justify-between items-center gap-4 mt-4">
      <span className="text-sm  w-24  mx-8  text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Pagination>
        <PaginationContent className="flex gap-2">
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <PaginationPrevious className="mr-2" />
            </Button>
          </PaginationItem>
          {currentPage}
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <PaginationNext className="ml-2" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}