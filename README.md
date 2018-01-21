# appdaemon-widgets
Appdaem Widgets for Home Assistant

- Media-Player Switch with volume slider
- Media-Player Source Select
- Climate Operation Mode Select


![Alt text](widgets_samples.png)

place the files in the directory /conf/custom_widgets
edit variables.yaml in your own or the default skin.
the lines to add can be found in here in custom_css/default/variables.yaml

usage in dashboard:

```
your_speaker:
    widget_type: media_with_volume
    title: Your Title
    title2: Your Subtitle
    entity: media_player.your_media_player
    icon_on: mdi-speaker
    icon_off: mdi-speaker-off
    step: 3
    
your_media_select:
  widget_type: media_select
  entity: media_player.your_media_player
  title: Your Title
  title2: Your Subtitle
  
your_climate_select:
  widget_type: climate_select
  entity: climate.your_climate
  title: Your Title
  title2: Your Subtitle
