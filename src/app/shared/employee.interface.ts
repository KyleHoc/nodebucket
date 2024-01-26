//--------------------------------------------
//Title: employee.interface.ts
//Author: Kyle Hochdoerfer
//Date: 01/24/24
//Description: Employee interface for Nodebucket
//---------------------------------------------

//Import item from the item interface
import { Item } from "./item.interface"

//Export employee interface with an empId number, and Item arrays for todo and done
export interface Employee{
  empId: number;
  todo: Item[];
  done: Item[];
}