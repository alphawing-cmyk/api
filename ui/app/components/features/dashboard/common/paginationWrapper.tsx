import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "~/components/ui/pagination";
  
  
  interface Props{
    numPages: number;
    currentPage: number;
    handleActivePage: (page: number, action: string)=>void;
  }
  
  const PaginationWrapper = ({ numPages, currentPage, handleActivePage }: Props) => {
  
    const renderPageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= numPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return pages;
    };
  
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => { handleActivePage(currentPage, "decrement"); }}  />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={() => { handleActivePage(currentPage, "increment"); }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  export default PaginationWrapper;
  