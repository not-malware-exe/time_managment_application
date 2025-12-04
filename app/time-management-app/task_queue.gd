extends VBoxContainer
class_name TaskQueue

@export var task_edit_tab_container : Control = null

func append_task_box(task_box : TaskBox):
	add_child(task_box)
	task_box.task_queue = self
	task_box.editted.connect(task_edit_tab_container.editing_task)

func move_task_box_up(task_box : TaskBox):
	
	var current_index = task_box.get_index( )
	if current_index-1 >= 0: move_child(task_box,current_index-1)
	

func move_task_box_down(task_box : TaskBox):
	
	var current_index = task_box.get_index( )
	move_child(task_box,current_index+1)
