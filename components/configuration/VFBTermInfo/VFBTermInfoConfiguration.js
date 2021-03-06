const buttonBarConfiguration = {
  "Events": ["color:set", "experiment:selection_changed", "experiment:visibility_changed"],
  "filter": function filter (instancePath) {
    if (typeof (instancePath) == "string") {
      return Instances.getInstance(instancePath).getParent();
    }
    return instancePath.getParent();
  },
  "VisualCapability": {
    "select": {
      "id": "select",
      "condition": "GEPPETTO.SceneController.isSelected($instance$.$instance$_obj != undefined ? [$instance$.$instance$_obj] : []) ||  GEPPETTO.SceneController.isSelected($instance$.$instance$_swc != undefined ? [$instance$.$instance$_swc] : [])",
      "false": {
        "actions": ["$instance$.select()"],
        "icon": "fa-hand-stop-o",
        "label": "Unselected",
        "tooltip": "Select",
        "id": "select",
      },
      "true": {
        "actions": ["$instance$.deselect()"],
        "icon": "fa-hand-rock-o",
        "label": "Selected",
        "tooltip": "Deselect",
        "id": "deselect",
      }
    },
    "color": {
      "id": "color",
      "actions": ["$instance$.setColor('$param$');"],
      "icon": "fa-tint",
      "label": "Color",
      "tooltip": "Color"
    },
    "zoom": {
      "id": "zoom",
      "actions": ["GEPPETTO.SceneController.zoomTo($instances$)"],
      "icon": "fa-search-plus",
      "label": "Zoom",
      "tooltip": "Zoom"
    },
    "visibility_obj": {
      "showCondition": "$instance$.getType().hasVariable($instance$.getId() + '_obj')",
      "condition": "(function() { var visible = false; if ($instance$.getType().$instance$_obj != undefined && $instance$.getType().$instance$_obj.getType().getMetaType() != GEPPETTO.Resources.IMPORT_TYPE && $instance$.$instance$_obj != undefined) { visible = GEPPETTO.SceneController.isVisible([$instance$.$instance$_obj]); } return visible; })()",
      "false": {
        "id": "visibility_obj",
        "actions": ["(function(){var color = $instance$.getColor(); var instance = Instances.getInstance('$instance$.$instance$_obj'); if (instance.getType().getMetaType() == GEPPETTO.Resources.IMPORT_TYPE) { var col = instance.getParent().getColor(); instance.getType().resolve(function() { instance.setColor(col); GEPPETTO.trigger('experiment:visibility_changed', instance); GEPPETTO.ControlPanel.refresh(); }); } else { if(GEPPETTO.SceneController.isInstancePresent(instance)) { GEPPETTO.SceneController.show([instance]); } else { GEPPETTO.SceneController.display(instance); instance.setColor(color);}}})()"],
        "icon": "gpt-shapehide",
        "label": "Hidden",
        "tooltip": "Show 3D Volume"
      },
      "true": {
        "id": "visibility_obj",
        "actions": ["GEPPETTO.SceneController.hide([$instance$.$instance$_obj])"],
        "icon": "gpt-shapeshow",
        "label": "Visible",
        "tooltip": "Hide 3D Volume"
      }
    },
    "visibility_swc": {
      "showCondition": "$instance$.getType().hasVariable($instance$.getId() + '_swc')",
      "condition": "(function() { var visible = false; if ($instance$.getType().$instance$_swc != undefined && $instance$.getType().$instance$_swc.getType().getMetaType() != GEPPETTO.Resources.IMPORT_TYPE && $instance$.$instance$_swc != undefined) { visible = GEPPETTO.SceneController.isVisible([$instance$.$instance$_swc]); } return visible; })()",
      "false": {
        "id": "visibility_swc",
        "actions": ["(function(){var color = $instance$.getColor(); var instance = Instances.getInstance('$instance$.$instance$_swc'); if (instance.getType().getMetaType() == GEPPETTO.Resources.IMPORT_TYPE) { var col = instance.getParent().getColor(); instance.getType().resolve(function() { instance.setColor(col); GEPPETTO.trigger('experiment:visibility_changed', instance); GEPPETTO.ControlPanel.refresh(); }); } else { if(GEPPETTO.SceneController.isInstancePresent(instance)) { GEPPETTO.SceneController.show([instance]); } else { GEPPETTO.SceneController.display(instance); instance.setColor(color);}}})()"],
        "icon": "gpt-3dhide",
        "label": "Hidden",
        "tooltip": "Show 3D Skeleton"
      },
      "true": {
        "id": "visibility_swc",
        "actions": ["GEPPETTO.SceneController.hide([$instance$.$instance$_swc])"],
        "icon": "gpt-3dshow",
        "label": "Visible",
        "tooltip": "Hide 3D Skeleton"
      }
    },
    "delete": {
      "showCondition": "$instance$.getId()!=window.templateID",
      "id": "delete",
      "actions": ["if($instance$.parent != null){$instance$.parent.deselect();$instance$.parent.delete();}else{$instance$.deselect();$instance$.delete();};setTermInfo(window[window.templateID][window.templateID+'_meta'], window[window.templateID].getId());"],
      "icon": "fa-trash-o",
      "label": "Delete",
      "tooltip": "Delete"
    }
  }
};

const buttonBarControls = {
  "VisualCapability": ['select',
                       'color',
                       'visibility_obj',
                       'visibility_swc',
                       'zoom',
                       'delete']
};


module.exports = {
  buttonBarConfiguration,
  buttonBarControls
};