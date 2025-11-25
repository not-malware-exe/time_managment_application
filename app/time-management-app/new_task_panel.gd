@tool
extends VBoxContainer

@export var task_box_scene : PackedScene = null
@onready var name_entry_box : LineEdit = $Name
@onready var description_entry_box : TextEdit = $Description
@onready var link_entry_box : LineEdit = $Link
@onready var e_hour : LineEdit = $estimated_time_container/e_hour
@onready var e_minute : LineEdit = $estimated_time_container/e_minute


func _on_submit_button_pressed() -> void:
	
	var estimated_time : float = float(str_to_int(e_minute.text) + str_to_int(e_hour.text) * 60)
	
	var new_task = Task.new(
		name_entry_box.text,
		description_entry_box.text,
		link_entry_box.text,
		estimated_time
	)
	
	new_task.print_vars()
	
	var new_task_box : TaskBox = task_box_scene.instantiate()
	#await name_entry_box.ready
	new_task_box.set_task(new_task)
	add_child(new_task_box)
	


func str_to_int(str : String = ""):
	var value = str_to_var(str)
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
	
