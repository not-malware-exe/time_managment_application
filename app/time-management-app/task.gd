extends Node
class_name Task

var task_name:String=""
var task_description:String=""
var task_link:String=""
var estimate_time:float=0.0 #minutes
var time_position:float=0.0 #minutes

func _init(new_name : String, new_description : String, new_link : String, new_est_time : float, new_time_pos : float = -1.0):
	
	task_name = new_name
	task_description = new_description
	task_link = new_link
	estimate_time = new_est_time
	time_position = new_time_pos
	

func print_vars():
	
	print("[",task_name,", ",task_description,", ",task_link,", ",estimate_time,", ",time_position,"]")
	

signal deleted(task:Task)
func delete():
	deleted.emit(self)
