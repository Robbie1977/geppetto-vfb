define(function(require) {

	var React = require('react');
	var GEPPETTO = require('geppetto');

	$.widget.bridge('uitooltip', $.ui.tooltip);

	var button = React.createClass({
		attachTooltip: function(){
			var self = this;
			$("#"+this.props.configuration.id).uitooltip({
				position: this.props.configuration.tooltipPosition,
				tooltipClass: "tooltip-persist",
				show: {
					effect: "slide",
					direction: "right",
					delay: 200
				},
				hide: {
					effect: "slide",
					direction: "right",
					delay: 200
				},
				content: function () {
					return self.state.tooltipLabel;
				},
			});
		},

		showToolTip : function(tooltipLabel, tooltipPosition){
			var position = tooltipPosition;
			if(position==undefined){
				position = this.props.configuration.tooltipPosition;
			}
			$("#"+this.props.configuration.id).uitooltip("option", "show");
			// update contents of what's displayed on tooltip
			$("#"+this.props.configuration.id).uitooltip({content: tooltipLabel,
				position: position});
			$("#"+this.props.configuration.id).mouseover().delay(2000).queue(function(){$(this).mouseout().dequeue();});
		},

		hideToolTip : function(){
			$("#"+this.props.configuration.id).uitooltip("option", "hide");
		},

		getInitialState: function() {
			return {
				disableButton : this.props.configuration.disabled,
				tooltipLabel : this.props.configuration.tooltipLabel,
				icon: this.props.configuration.icon
			};
		},

		componentDidMount: function() {
			this.attachTooltip();
			this.props.configuration.eventHandler(this);
		},

		render:  function () {
			return (
					<div>
					<button className={this.props.configuration.className+" btn pull-right"} type="button" title=''
						id={this.props.configuration.id} rel="tooltip" onClick={this.props.configuration.onClick}>
					<i className={this.state.icon}></i>
					</button>
					</div>
			);
		}
	});
	return button;
});
