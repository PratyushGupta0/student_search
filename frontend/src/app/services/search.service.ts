import { of as observableOf, Observable } from 'rxjs';
import { concat, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SearchHelper } from '../helpers/search.helper';
import { Student } from '../models/student.model';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  getInformation(): Observable<Array<Student>> {
    const request = this.http
      .get<Array<Student>>('/api/students')
      .pipe(map((students: Array<Student>) => {
        function compare(a: Student, b: Student) {
          if (a.i < b.i) {
            return -1;
          }
          if (a.i > b.i) {
            return 1;
          }
          return 0;
        }
        const sorted = students.sort(compare);
        localStorage.setItem('search-data', JSON.stringify(sorted));
        return sorted;
      }));
    if (localStorage.getItem('search-data')) {
      const students = JSON.parse(localStorage.getItem('search-data')) as Array<Student>;
      return observableOf(students).pipe(concat(request));
    } else {
      return request;
    }
  }

  getResults(students: Array<Student>, term: string, year?: Array<string>, gender?: string,
             hall?: Array<string>, prog?: Array<string>, dep?: Array<string>,
             grp?: Array<string>, hometown ?: string): Array<Student> {

    const escape = (s: string) => {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };


    const filter = (elem: Student): Boolean => {

      if (!(year === null || year.length === 0)) {
        if (!year.includes(SearchHelper.ParseYear(elem.i))) {
          return false;
        }
      }

      if (!(gender === null || gender === 'Any')) {
        if (elem.g !== gender) {
          return false;
        }
      }

      if (!(hall === null || hall.length === 0)) {
        if (!hall.includes(elem.h)) {
          return false;
        }
      }

      if (!(prog === null || prog.length === 0)) {
        if (!prog.includes(elem.p)) {
          return false;
        }
      }

      if (!(dep === null || dep.length === 0)) {
        if (!(dep.includes(SearchHelper.ParseBranch(elem.d)))) {
          return false;
        }
      }

      if (!(grp === null || grp.length === 0)) {
        if (!grp.includes(elem.b)) {
          return false;
        }
      }

      if (!(hometown === null || hometown === '')) {
        const addregex = new RegExp(hometown, 'i');
        if (!addregex.test(elem.a)) {
          return false;
        }
      }

      if (!(term === null || term === '')) {
        let arr=term.split(" ");
if(arr.length===2)
{
const n1=new RegExp(escape(arr[0]).replace(/\s+/g, ' '), 'i');
const n2=new RegExp(escape(arr[1]).replace(/\s+/g, ' '), 'i');
return ((n1.test(elem.i) || n1.test(elem.u) || n1.test(elem.n.replace(/\s+/g, ' ')))&&(n2.test(elem.i) || n2.test(elem.u) || n2.test(elem.n.replace(/\s+/g, ' '))));
}
if(arr.length===1)
{
const termregex = new RegExp(escape(term).replace(/\s+/g, ' '), 'i');
        return (termregex.test(elem.i) || termregex.test(elem.u) || termregex.test(elem.n.replace(/\s+/g, ' ')));
}
if(arr.length===3)
{
const n1=new RegExp(escape(arr[0]).replace(/\s+/g, ' '), 'i');
const n2=new RegExp(escape(arr[1]).replace(/\s+/g, ' '), 'i');
const n3=new RegExp(escape(arr[2]).replace(/\s+/g, ' '), 'i');
return ((n1.test(elem.i) || n1.test(elem.u) || n1.test(elem.n.replace(/\s+/g, ' ')))&&(n2.test(elem.i) || n2.test(elem.u) || n2.test(elem.n.replace(/\s+/g, ' ')))&&(n3.test(elem.i) || n3.test(elem.u) || n3.test(elem.n.replace(/\s+/g, ' '))));
}
//         const termregex = new RegExp(escape(term).replace(/\s+/g, ' '), 'i');
//         return (termregex.test(elem.i) || termregex.test(elem.u) || termregex.test(elem.n.replace(/\s+/g, ' ')));
      }

      return true;

    };

    // Use forloop instead of filter
    // see https://jsperf.com/javascript-filter-vs-loop
    // return students.filter(filter);

    const resultArray = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (filter(student)) {
        resultArray.push(student);
      }
    }
    return resultArray;

  }

}
