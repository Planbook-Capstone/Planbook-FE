import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface BookSelectorProps {
  title?: string;
  gradeOptions: { id: string; name: string }[];
  subjectOptions: { id: string; name: string }[];
  bookOptions: { id: string; name: string }[];
  selectedGrade: string;
  selectedSubject: string;
  selectedBook: string;
  onGradeChange: (val: string) => void;
  onSubjectChange: (val: string) => void;
  onBookChange: (val: string) => void;
}

const BookSelector: React.FC<BookSelectorProps> = ({
  title = "Chọn sách",
  gradeOptions,
  subjectOptions,
  bookOptions,
  selectedGrade,
  selectedSubject,
  selectedBook,
  onGradeChange,
  onSubjectChange,
  onBookChange,
}) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-lg font-calsans">Sách</h1>
      <h3 className="text-base font-questrial text-neutral-500">{title}</h3>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 font-questrial">
      <div className="flex-col w-full">
        <p className="pl-2 text-xs pb-1">Khối học</p>
        <Select value={selectedGrade} onValueChange={onGradeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn lớp" />
          </SelectTrigger>
          <SelectContent>
            {gradeOptions.map((grade) => (
              <SelectItem key={grade.id} value={grade.id.toString()}>
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-col w-full font-questrial">
        <p className="pl-2 text-xs pb-1">Môn học</p>
        <Select
          value={selectedSubject}
          onValueChange={onSubjectChange}
          disabled={!selectedGrade}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={selectedGrade ? "Chọn môn học" : "Chọn lớp trước"}
            />
          </SelectTrigger>
          <SelectContent>
            {subjectOptions.map((subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-col w-full col-span-2 lg:col-span-1 font-questrial">
        <p className="pl-2 text-xs pb-1">Sách</p>
        <Select
          value={selectedBook}
          onValueChange={onBookChange}
          disabled={!selectedSubject}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={selectedSubject ? "Chọn sách" : "Chọn môn học trước"}
            />
          </SelectTrigger>
          <SelectContent>
            {bookOptions.map((book) => (
              <SelectItem key={book.id} value={book.id.toString()}>
                {book.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

export default BookSelector;
