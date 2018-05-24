需要引入相应的js文件
```
<!DOCTYPE HTML>
<html>
<head>
    <!-- when using the mode "code", it's important to specify charset utf-8 -->
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="bootstrap.min.css">
    <!-- Optional theme -->
    <link rel="stylesheet" href="bootstrap-theme.min.css">
    <!-- Latest compiled and minified JavaScript -->
    <script src="jquery-2.2.3.min.js"></script>
    <!-- Latest compiled and minified JavaScript -->
    <script src="bootstrap.min.js"></script>
    <link href="jsoneditor.min.css" rel="stylesheet" type="text/css">
    <script src="jsoneditor.min.js"></script>
</head>
<body>
<div class="row">
    <div class="col-xs-6" style="height:100%">
        <div id="jsoneditor_input" style=" height: 900px;"></div>
    </div>
    <div class="col-xs-6" style="height:100%">
        <div id="jsoneditor_output" style="height: 900px;"></div>
    </div>
</div>
<script>
    // create the editor
    var container_input = document.getElementById("jsoneditor_input");
    var options_input = {
        mode: 'code',
        onChange:function(){
            var jsonstr = editor_input.get();
            editor_output.set(jsonstr);
        }
    };
    var editor_input = new JSONEditor(container_input, options_input);
    // set json
    var json_input = {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": {"a": "b", "c": "d"},
        "String": "Hello World"
    };
    editor_input.set(json_input);
    // get json
    var json_input = editor_input.get();
</script>
<script>
    // create the editor
    var container_output = document.getElementById("jsoneditor_output");
    var options_output = {
        onChange:function(){
            var jsonstr = editor_output.get();
            editor_input.set(jsonstr);
        }
    };
    var editor_output = new JSONEditor(container_output, options_output);
    var jsonstr = editor_input.get();
    editor_output.set(jsonstr);
</script>
</body>
</html>
```
