//--------------------------------------------
//Title: task.service.ts
//Author: Kyle Hochdoerfer
//Date: 01/24/24
//Description: Task service for Nodebucket
//---------------------------------------------

//Import statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './item.interface';

//Create and export the task service class
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  //Declare a constructor and pass httpClient in as a parameter
  constructor(private http: HttpClient) {}

  //Create a function that returns an http request for getting all tasks
  getTasks(empId: number){
    return this.http.get('/api/employees/' + empId + '/tasks');
  }

  //Create a function that returns an http request for adding a new task
  addTask(empId: number, text: string){
    return this.http.post('/api/employees/' + empId + '/tasks', {text})
  }

  //Create a function that returns an http request for deleting a task
  deleteTask(empId: number, taskId: string){
    console.log('/api/employees/' + empId + '/tasks/' + taskId)
    return this.http.delete('/api/employees/' + empId + '/tasks/' + taskId)
  }

  //Create a function that returns an http request for updating the done and todo lists
  updateTask(empId: number, todo: Item[], done: Item[] ){
    return this.http.put('/api/employees/' + empId + '/tasks/' , {
      todo,
      done
    })
  }
 }