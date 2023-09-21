export interface SubjectMasterClass {
    name: string,
    classId: string,
    boardId: string,
    mediumId: string,
    order: number,
    subjectArray?: SubjectArray[];
    id?: string
}

export interface SubjectArray {
    name: string
}
export interface BookMasterClass {
    name: string,
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    id?: string
}

export interface ChapterMasterClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterName: string,
    thumbnail: string
    order: number,
    id?:string,
    chapterArray?: ChapterArrayClass[]
}

export interface ChapterArrayClass {
    chapterName: string,
    thumbnail: string,
}
export interface BoardMasterClass {
    name: string,
    id: string,
}
export interface PlanMasterClass {
    presentatorName: string,
    qualification: string,
    experience: string,
    schoolName: string,    
    id: string,
}
export interface VideoMasterClass {
    studioName: string,
    location: string,         
    id: string,
}
export interface ClassMasterClass{
    mediumId: string,
    className: string,
    order: number,
    id?: string
}
export interface MediumMasterClass {
    name: string,
    boardId: string,
    id?: string
}

export interface LoginClass {
    email: string,
    password: string
}

export interface LessonMasterClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterId: string,
    order: number,
    lessonArray?: lessonArray[];
    id?: string,
    name: string,
    type: string,
    thumbnail: string,
    poster: string
}

export interface lessonArray {
    name: string
}