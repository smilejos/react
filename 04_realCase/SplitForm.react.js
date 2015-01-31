var SplitTable = React.createClass({
	getInitialState: function() {   
    	return {
    		info: {}, 
    		origin: {},
    		adjust: {},
    		splitArray: []
    	};
  	}, 
  	handleChange: function(rowObject){

	  	var splitArray = this.state.splitArray;
	  	var object = splitArray.splice(rowObject.index, 1)[0];
	  	object.Qty = rowObject.Qty;
	  	object.UnitPrice = rowObject.UnitPrice;

	  	splitArray.splice(rowObject.index, 0, object);
	  	var adjust = this.handleSummary(splitArray);

		this.setState({
			splitArray: splitArray,
			adjust: adjust
		});
  	},
	handleDelete: function(rowIndex){
        console.log(rowIndex);
        
		var splitArray = this.state.splitArray;
		splitArray.splice(rowIndex, 1);
		var adjust = this.handleSummary(splitArray);
		this.setState({
			splitArray: splitArray,
			adjust: adjust
		});
	},
	handleInsert: function(){
		var splitArray = this.state.splitArray;
		splitArray.push({
			NOID: "",
			Qty: 0,
			UnitPrice: 0
		});

		this.setState({
			splitArray: splitArray
		});
	},
  	handleSummary: function(splitArray){
  		var data = {
  			Qty: 0,
  			TotalPrice: 0
  		};

  		$.each(splitArray, function(index, item){
  			data.Qty += parseInt(item.Qty);
  			data.TotalPrice += item.UnitPrice * item.Qty;
  		});

  		return data;
  	},
  	componentWillMount: function() {  
        var itemInfo = {
            NOID: "5566",
            Location : "KM",
            CostDepNo : "1131",
            AssetCategory : "PC",
            Phase : "11-1",
            Capacity : "130k",
            ToolId : "KC2530",
            Agent : "tsmc", 
            Vendor : "tsmc",
            Qty : 3,
            UnitPrice: 3125000
        };
        this.setState({
            info: itemInfo, 
            origin: {
                Qty: itemInfo.Qty,
                TotalPrice: itemInfo.Qty * itemInfo.UnitPrice
            },
            adjust: {
                Qty: itemInfo.Qty,
                TotalPrice: itemInfo.Qty * itemInfo.UnitPrice
            },
            splitArray: [{
                NOID: itemInfo.NOID,
                Qty: itemInfo.Qty,
                UnitPrice: itemInfo.UnitPrice
            }]
        });     
	}, 
	render: function() {   
		var isSameWithOrigin = this.state.origin.TotalPrice == this.state.adjust.TotalPrice;
		return (   
			<div className="content">
				<div className="infoBlock">
					<TableInfo info={this.state.info}/>   
				</div>
				<div className="infoBlock">
					<div className="dynamicBlock">
						<TableSummary origin={this.state.origin} adjust={this.state.adjust} />
					</div>
					<div className="dynamicBlock">
						<TableSplit splitArray={this.state.splitArray} onRowChange={this.handleChange} onRowDelete={this.handleDelete}/>
					</div>
				</div>
				<div className="infoBlock">
					<input type="button" value="Add Row" onClick={this.handleInsert}/>
					<input type="button" value="Save Record" disabled= {isSameWithOrigin ? "" : "disabled"} />
				</div>
			</div> 
		);   
	}   
});   

var TableInfo =  React.createClass({   
	 render: function () {   
		var info = this.props.info;
		return (   
			<table className="infoTable">   
				<tr>
					<td className="infoTd">NOID</td>
					<td className="infoTd">Location</td>
					<td className="infoTd">CostDepNo</td>
					<td className="infoTd">AssetCategory</td>
					<td className="infoTd">Phase</td>
					<td className="infoTd">Capacity</td>
					<td className="infoTd">ToolId</td>
					<td className="infoTd">Agent</td>
					<td className="infoTd">Vendor</td>
				</tr>
				<tr>
					<td className="infoTd">{info.NOID}</td>
					<td className="infoTd">{info.Location}</td>
					<td className="infoTd">{info.CostDepNo}</td>
					<td className="infoTd">{info.AssetCategory}</td>
					<td className="infoTd">{info.Phase}</td>
					<td className="infoTd">{info.Capacity}</td>
					<td className="infoTd">{info.ToolId}</td>
					<td className="infoTd">{info.Agent}</td>
					<td className="infoTd">{info.Vendor}</td>
				</tr>
			</table>   
		);   
    }   
});   


var TableSummary =  React.createClass({  
	
  	render: function () {   
		var origin = this.props.origin;
		var adjust = this.props.adjust;
		var isSameWithOrigin = origin.TotalPrice == adjust.TotalPrice;
		return (   
			<table className="summaryTable">   
				<tr>
					<td className="infoTd">Name</td>
					<td className="infoTd">Qty</td>
					<td className="infoTd">Total_Price</td>
				</tr>
				<tr>
					<td className="infoTd">Origin</td>
					<td className="infoTd">{origin.Qty}</td>
					<td className="infoTd">{origin.TotalPrice}</td>
				</tr>
				<tr>
					<td className= { isSameWithOrigin ? "infoTd CompareSame": "infoTd CompareDiff"}>Adjust</td>
					<td className= { isSameWithOrigin ? "infoTd CompareSame": "infoTd CompareDiff"} >{adjust.Qty}</td>
					<td className= { isSameWithOrigin ? "infoTd CompareSame": "infoTd CompareDiff"} >{adjust.TotalPrice}</td>
				</tr>
			</table>   
		);   
    } 
});  

var TableSplit = React.createClass({   
	handleChange: function(rowObject){
		this.props.onRowChange(rowObject);
	},
	handleDelete: function(rowIndex){
		this.props.onRowDelete(rowIndex);
	},
  	render: function() {  
  		var _this = this;
  		var splitArray = this.props.splitArray.map(function (data, index) {
            return <DynamicRow data={data} index={index} onRowChange={_this.handleChange} onRowDelete={_this.handleDelete}/>
        });
        var titleArray = (function(){
        	return (
        		<tr>
        			<td className="infoTd">NOID</td>
					<td className="infoTd">Qty</td>
					<td className="infoTd">Unit_Price</td>
					<td className="infoTd">Total_Price</td>
					<td className="infoTd"></td>
				</tr>
    		)
        })();

		return (  
			<table className="adjustTable">   
				{titleArray}
				{splitArray}
			</table>   
		);   
	} 
}); 

var DynamicRow = React.createClass({   
	handleChange: function(e){
		var Qty = this.refs.Qty.getDOMNode().value.replace(/[^\d]/g,'');
		var UnitPrice = this.refs.UnitPrice.getDOMNode().value.replace(/[^\d]/g,'');
		
		Qty = Qty.length == 0 ? "0" : Qty;
		UnitPrice = UnitPrice.length == 0 ? "0" : UnitPrice;

		this.refs.Qty.getDOMNode().value = Qty;
		this.refs.UnitPrice.getDOMNode().value = UnitPrice;

		this.props.onRowChange({
			index: this.props.index,
			Qty: Qty,
			UnitPrice: UnitPrice
		});
	},
	handleDelete: function(e){
		if( this.props.index > 0) {
			this.props.onRowDelete(this.props.index);
		}
	},
	render: function() {  
		var data = this.props.data;
		var index = this.props.index;
  		return (
        	<tr key={index}>
        		<td className="infoTd">{data.NOID}</td>
        		<td className="infoTd"><input type="text" className="qtyTextbox" ref="Qty" defaultValue={data.Qty} onChange={this.handleChange} /></td>
        		<td className="infoTd"><input type="text" className="priceTextbox" ref="UnitPrice" defaultValue={data.UnitPrice} onChange={this.handleChange} /></td>
        		<td className="infoTd">{data.Qty * data.UnitPrice}</td>
        		<td className= { this.props.index == 0 ? "infoTd": "infoTd deleteAction"}  onClick={this.handleDelete}>{ this.props.index == 0 ? "" : "Delete" }</td>
    		</tr>
		)
	}   
});

React.render(   
	<SplitTable />,   
	document.getElementById("content")   
);  
