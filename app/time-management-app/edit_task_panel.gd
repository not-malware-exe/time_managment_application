@tool
extends VBoxContainer

@onready var name_entry_box : LineEdit = $Name
@onready var description_entry_box : TextEdit = $Description
@onready var link_entry_box : LineEdit = $Link
@onready var e_hour : LineEdit = $estimated_time_container/e_hour
@onready var e_minute : LineEdit = $estimated_time_container/e_minute

var editing_task_box : TaskBox = null

func set_editing_task_box(task_box : TaskBox):
	
	editing_task_box = task_box
	name_entry_box.text = task_box.name_lable.text
	description_entry_box.text = task_box.description_lable.text
	link_entry_box.text = task_box.link_button.uri
	
	e_hour.text = task_box.est_time_lable.text[0]+task_box.est_time_lable.text[1]
	e_minute.text = task_box.est_time_lable.text[5]+task_box.est_time_lable.text[6]
	

func _on_submit_button_pressed() -> void:
	
	var editing_task = editing_task_box.task
	
	var estimated_time : float = float(str_to_int(e_minute.text) + str_to_int(e_hour.text) * 60)
	
	editing_task.update_task(
		name_entry_box.text,
		description_entry_box.text,
		link_entry_box.text,
		estimated_time
	)
	
	#new_task.print_vars()
	
	#await name_entry_box.ready
	editing_task_box.update()
	
	reset()
	

func reset():
	name_entry_box.text = ""
	description_entry_box.text = ""
	link_entry_box.text = ""
	e_hour.text = "00"
	e_minute.text = "30"

func str_to_int(string : String = ""):
	var value = str_to_var(string)
	if value is int:
		return value
	else:
		return 0

func get_time_text(text : String):
	
	var integer = str_to_int(text)
	
	var new_text = var_to_str(integer)
	if new_text.length() == 1:
		new_text = "0" + new_text
	return new_text

func _on_e_hour_editing_toggled(toggled_on: bool) -> void:
	
	if toggled_on: e_hour.text = ""
	else: e_hour.text = get_time_text(e_hour.text)
	


func _on_e_minute_editing_toggled(toggled_on: bool) -> void:
	
	if toggled_on: e_minute.text = ""
	else: e_minute.text = get_time_text(e_minute.text)
	
