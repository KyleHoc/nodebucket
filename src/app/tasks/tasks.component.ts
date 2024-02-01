//--------------------------------------------
//Title: tasks.components.ts
//Author: Kyle Hochdoerfer
//Date: 01/24/24
//Description: Typescript for task component
//---------------------------------------------

//Import statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from '../shared/task.service';
import { Employee } from '../shared/employee.interface';
import { Item } from '../shared/item.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'

//Export and create the task component class
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  //Declare variables for employee, empId, todo and done, and success and error messages
  employee: Employee;
  empId: number;
  todo: Item[];
  done: Item[];
  errorMessage: string;
  successMessage: string;

  //Declare a new task form that validates required fields, a minimum length of 3, and a maximum length of 50
  newTaskForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])]
  })

  //Declare a constructor that accepts cookie service, task service, and form builder as parameters
  constructor(private cookieService: CookieService, private taskService: TaskService, private fb: FormBuilder){

    //Set the default values for employee, todo, done, and the message variables
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];
    this.errorMessage = ""
    this.successMessage = ""

    //Set the value of empId by getting it from the cookie service
    this.empId = parseInt(this.cookieService.get('session_user'), 10);

    //Call the get Tasks function using the task service and pass in the empId
    this.taskService.getTasks(this.empId).subscribe({
      //For next:
      next: (res: any) => {
        //Output the employee to the console
        console.log('Employee', res)

        //Set this.employee to the response
        this.employee = res
      },
      //For errors:
      error: (err) => {
        //Output the error to the console
        console.error('error', err);

        //Change the value of errorMessage to match the error, and hide the alert after 5 seconds
        this.errorMessage = err.message
        this.hideAlert()
      },
      //For complete
      complete: () => {
        //If the the employee todo list exists
        if(this.employee.todo){
          //Set the todo variable to equal the employees todo list
          this.todo = this.employee.todo
        } else {
          //If the employee does not have a todo array, create an empty one for them
          this.todo = []
        }

        //If the employee's done list exists
        if(this.employee.done){
          //Set the done variable to equal the employees done list
          this.done = this.employee.done
        } else {
          //If the employee does not have a done array, create an empty one for them
          this.done = []
        }

        //Hide the following alert after 5 seconds
        this.hideAlert();
      }
    })
  }

  //Declare a function for adding the task to the todo array
  addTask(){
    //Declare a text variable to hold the user input from the form
    const text = this.newTaskForm.controls['text'].value;

    //Call the add task function from the task service, passing in the empId and text input
    this.taskService.addTask(this.empId, text).subscribe({
      next: (task: any) => {
        //Output a message to the console stating that the task was added
        console.log("Task added with id " + task.id);

        //Create a constant to hold the new task, giving it the task id and text
        const newTask = {
          _id: task.id,
          text: text
        }

        //Push the new task onto the todo list
        this.todo.push(newTask);

        //Reset the task form
        this.newTaskForm.reset();

        //Set the successMessage variable to hold a message stating that the task was created
        this.successMessage = "Task successfully added"

        //Hider the resulting alert after 5 seconds
        this.hideAlert();
      },
      error: (err) => {
        //Output an error message and store it in the error message variable
        console.log('error', err);
        this.errorMessage = err.message

        //Hide the error message after 5 seconds
        this.hideAlert();
      }
    })
  }

  //Create a function for deleting tasks
  deleteTask(taskId: string){
    //Output the id of the task to detele
    console.log(`Task Item: ${taskId}`)

    //Confirm whether the user is sure that they want to delete the task or not
    if(!confirm("Are you sure you want to delete this task?")){
      return
    }

    //Call the delete task function and subscribe to the observable while passing in empId and taskId
    this.taskService.deleteTask(this.empId, taskId).subscribe({
      //If the task is deleted successfully, remove it from the task array
      next: (res: any) => {
        console.log('Task deleted with id ', taskId)

        //If the todo or done arrays are null, set them to an empty array
        if (!this.todo) this.todo = []
        if (!this.todo) this.todo = []

        //Filter the todo and done arrays to remove the deleted task
        this.todo = this.todo.filter(t => t._id.toString() !== taskId)
        this.done = this.done.filter(t => t._id.toString() !== taskId)

        //Set the success message
        this.successMessage = 'Task deleted'

        //Hide the resulting alert after five seconds
        this.hideAlert()
      },
      error: (err) => {
        //If there is an error, log it to the console and set the error message
        console.log('error', err);
        this.errorMessage = err.message
        this.hideAlert()
      }
    })
  }

  //Create a drop event for dragging and dropping task items between todo and done lists using cdkDragDrop
  drop(event: CdkDragDrop<any[]>){
    //If an item is dropped in the same container, move it to the new index
    if (event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)

      //Log the result to the console
      console.log('Moved item in array ', event.container.data)

      //Call the update task list function and pass in empId, and the todo and done arrays
      this.updateTaskList(this.empId, this.todo, this.done)
    } else {
      //If an item is dropped in a different container, move it there
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )

      //Log a message stating the result to the console
      console.log('Moved item in array ', event.container.data)

      //Call the updateTaskList function and pass in empId, todo, and done
      this.updateTaskList(this.empId, this.todo, this.done)
    }
  }

  //Create a function that hides the error or success message after 5 seconds
  hideAlert(){
    //Set error and success message to be blank after 5 seconds
    setTimeout(() => {
      this.errorMessage = ''
      this.successMessage = ''
    }, 5000)
  }

  //Create a function for updating the task arrays
  updateTaskList(empId: number, todo: Item[], done: Item[]){
    //Call the update task function from taskService and pass in empId, todo, and done
    this.taskService.updateTask(empId, todo, done).subscribe({
      //If the process was successful, log a success message to the console
      next: (res: any) => {
        console.log('Task updated successfully')
      },
      error: (err) => {
        //In the event of an error, log the error message to the console and set errorMessage
        console.log('error', err)
        this.errorMessage = err.message
        this.hideAlert()
      }
    })
  }
}