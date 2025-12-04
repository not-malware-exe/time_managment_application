extends Control
class_name SmallTaskBox

@export var name_lable : Label
@export var time_range_lable : Label

var start_time : float = 0.0

var task : Task = null

func set_task(new_task : Task = null):
	
	task = new_task
	update()
	

func get_time_text(integer : int):
	
	var new_text = var_to_str(integer)
	if new_text.length() == 1:
		new_text = "0" + new_text
	return new_text

func set_est_time_text():
	
	var minutes : int = wrap(task.estimate_time,0.0,60.0)
	var hours : int = (task.estimate_time - minutes)/60.0
	
	return  get_time_text(hours) + " : " + get_time_text(minutes)

func update():
	
	name_lable.text = task.task_name
	#est_time_lable.text = set_est_time_text()
	
