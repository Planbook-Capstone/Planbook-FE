"use client";
import CreateBookTypeForm from "@/components/organisms/create-booktype-form";

function BookTypePage() {
  const fakeInitialValues = {
    name: "Sách Tiếng Anh",
    description: "Dùng để học tiếng Anh từ cơ bản đến nâng cao",
    tokenCostPerQuery: 20,
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTciIGhlaWdodD0iNjkiIHZpZXdCb3g9IjAgMCA1NyA2OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM0LjQzMzcgMEg2LjIwNjQzQzMuMzE5NDkgMCAwLjk3OTE1NiAyLjM0MDMzIDAuOTc5MTU2IDUuMjI3MjdWNjMuNzcyN0MwLjk3OTE1NiA2Ni42NTk3IDMuMzE5NDkgNjkgNi4yMDY0MyA2OUg1MS4xNjFDNTQuMDQ3OSA2OSA1Ni4zODgzIDY2LjY1OTcgNTYuMzg4MyA2My43NzI3VjIxLjQzMThMMzQuNDMzNyAwWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzcwOF80NTA0KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzcwOF80NTA0IiB4MT0iMjguNjgzNyIgeTE9IjAiIHgyPSIyOC42ODM3IiB5Mj0iNjkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzAwNERDMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDE5M0YiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
  };

  return (
    <div>
      <CreateBookTypeForm  />  
    </div>
  );
}

export default BookTypePage;
