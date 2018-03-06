function base_media_with_volume(widget_id, url, skin, parameters)
{
    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...
    
    self = this
    
    // Initialization
    
    self.widget_id = widget_id
    
    // Store on Volume or fallback to a default
        
    // Parameters may come in useful later on
    
    self.parameters = parameters
    // Parameter handling
    
    if ("monitored_entity" in self.parameters)
    {
        entity = self.parameters.monitored_entity
    }
    else
    {
        entity = self.parameters.entity
    }
    
    if ("on_volume_level" in self.parameters)
    {
        self.on_volume_level = self.parameters.on_volume_level
    }
    else
    {
        self.on_volume_level = 0.5
    }
       
    self.onChange = onChange
    self.OnButtonClick = OnButtonClick

    var callbacks = [
            {"selector": '#' + widget_id + ' > span', "action": "click", "callback": self.OnButtonClick},
            {"selector": '#' + widget_id + ' > div > input', "action": "change", "callback": self.onChange},
                    ]


            // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity
     
    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate
    
    if ("entity" in parameters)
    {
        var monitored_entities = 
            [
                {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate}
            ]
    }
    else
    {
        var monitored_entities =  []
    }
    // Finally, call the parent constructor to get things moving
    
    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)  

    // Function Definitions
    
    // The StateAvailable function will be called when 
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state
    // Methods

    function OnStateAvailable(self, state)
    {    
        self.state = state.state
        self.minvalue = 0
        self.maxvalue = 1
        if ("step" in self.parameters)
    	{
        self.stepvalue = self.parameters.step / 100;
    	}
    	else
    	{
        self.stepvalue = 0.1;
    	}

        if ("volume_level" in state.attributes)
        {
            self.volume_level = state.attributes.volume_level
        }
        else
        {
            self.volume_level = 0
        }
        set_options(self, self.minvalue, self.maxvalue, self.stepvalue, self.volume_level)
        set_view(self, self.state, self.volume_level)
    }
 
    function OnStateUpdate(self, state)
    {
        self.state = state.state;
        if ("volume_level" in state.attributes)
        {
            self.volume_level = state.attributes.volume_level
        }
        else
        {
            self.volume_level = 0
        }

        set_view(self, self.state, self.volume_level)
    }

    function OnButtonClick(self)
    {
        if (self.state == self.parameters.state_inactive)
        {
            args = self.parameters.post_service_active 
            if ("on_attributes" in self.parameters)
            {
                for (var attr in self.parameters.on_attributes)
                {
                    args[attr] = self.parameters.on_attributes[attr]
                }
            }
        }
        else
        {
            args = self.parameters.post_service_inactive
        }
        console.log(args)
        self.call_service(self, args)
        toggle(self)
    }

    function onChange(self, state)
    {
        setTimeout(function(){
        if (self.volume_level != self.ViewModel.Volume())
        {
            self.volume_level = self.ViewModel.Volume()
            args = self.parameters.post_service_volume
            args["volume_level"] = self.volume_level

	    self.call_service(self, args)
        }
        },500)
    }

    function toggle(self)
    {
        if (self.state == self.parameters.state_active)
        {
            self.state = self.parameters.state_inactive;
            self.volume_level = 0
        }
        else
        {
            self.state = self.parameters.state_active;
        }
        set_view(self, self.state, self.volume_level)
    }

    function set_options(self, minvalue, maxvalue, stepvalue, state)
    {
        self.set_field(self, "MinValue", minvalue)
        self.set_field(self, "MaxValue", maxvalue)
        self.set_field(self, "StepValue", stepvalue)
    }

    function set_view(self, state, volume)
    {
        
        if (state == self.parameters.state_active || ("active_map" in self.parameters && self.parameters.active_map.includes(state)))
        {
            // Set Icon will set the style correctly for an icon
            self.set_icon(self, "icon", self.icons.icon_on)
            // Set view will set the view for the appropriate field
            self.set_field(self, "icon_style", self.css.icon_style_active)
        }
        else
        {
            self.set_icon(self, "icon", self.icons.icon_off)
            self.set_field(self, "icon_style", self.css.icon_style_inactive)
        }
        if (typeof volume == 'undefined')
        {
            self.set_field(self, "Volume", 0)
        }
        else
        {
            self.set_field(self, "Volume", volume)
        }
    }

}
