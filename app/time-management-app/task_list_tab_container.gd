extends TabContainer


#func _on_new_button_pressed() -> void:
	#current_tab = 1

@export var task_edit : Control = null

func editing_task(task_box : TaskBox) -> void:
	current_tab = 1
	task_edit.set_editing_task_box(task_box)

func _on_return_button_pressed() -> void:
	current_tab = 0


func _on_submit_button_pressed() -> void:
	current_tab = 0
