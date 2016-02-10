# Country/Map selector

- **Author**: Adam Oliver

### Usage

```
var map = new CountryMap({
    countryCode: 'GBR',
    mapPaths: mapPaths,
    handleClick: function(state){
        alert("Clicked on "+state);
    }
});
map.draw();
```

Available settings:
- `width`
- `height`
- `mapPaths`
- `containerId`
- `countryCode`
- `handleClick`
- `fillColour`
- `hoverColour`