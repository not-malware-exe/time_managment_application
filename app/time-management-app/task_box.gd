extends Control
class_name TaskBox

@export var task_queue : TaskQueue

@export var name_lable : Label
@export var description_lable : RichTextLabel
@export var link_button : LinkButton
@export var est_time_lable : Label

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
	var hours : int = int((task.estimate_time - minutes)/60.0)
	
	return  get_time_text(hours) + " : " + get_time_text(minutes)

func update():
	
	name_lable.text = task.task_name
	description_lable.text = task.task_description
	link_button.uri = task.task_link
	link_button.visible = true if task.task_link else false
	est_time_lable.text = set_est_time_text()
	


func _on_up_button_pressed() -> void:
	
	task_queue.move_task_box_up(self)
	


func _on_down_button_pressed() -> void:
	
	task_queue.move_task_box_down(self)
	


signal editted()

func _on_edit_button_pressed() -> void:
	editted.emit(self)
