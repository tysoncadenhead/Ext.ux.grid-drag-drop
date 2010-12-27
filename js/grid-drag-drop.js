/*global Ext */

/*
 *	Ext.ux.DragDropGridPanels.js
 *
 *	PURPOSE:
 *	Reusable component for drag / drop grid panels
 *
 *	AUTHOR:
 *	Tyson Cadenhead /  tysonlloydcadenheadDotCom / tysoncadenheadAtGmailDotCom
 *
 *  @param rightGrid (Required) The grid component for the right side
 *  @param leftGrid (Required) The grid component for the left side
 */

Ext.ux.DragDropGridPanels = Ext.extend(Ext.Panel, {
	layout: 'hbox',
	initComponent: function () {
		var component = this, leftGrid = this.leftGrid, LeftGridCmp, rightGrid = this.rightGrid, RightGridCmp;
		
        Ext.ux.DragDropGridPanels.superclass.initComponent.call(this);
		
		// Left Grid
		if (leftGrid) {
			LeftGridCmp = Ext.extend(Ext.grid.EditorGridPanel, {
				height: component.height,
				enableDragDrop: true,
				ddGroup: 'right-' + component.id + '-dd-group',
				sm: new Ext.grid.RowSelectionModel({})
			});
			component.add(new LeftGridCmp(leftGrid));
		}
		else {
			throw ('Missing the leftGrid param in your Ext.DragDropGridPanels');
		}
		
		// Drag and drop arrows    
		component.add(new Ext.Panel({
			width: 20,
			cls: 'grid-drag-drop-center',
			height: component.height,
			items: [{
				height: (component.height / 2) - 25,
				width: 20
			}, {
				xtype: 'button',
				cls: 'ext-dd-arrow ext-dd-arrow-right',
				handler: function () {
					var firstGrid = component.getComponent(0), secondGrid = component.getComponent(2), firstGridStore = component.getComponent(0).store, secondGridStore = component.getComponent(2).store;
					var s = firstGrid.getSelectionModel().getSelections();
					for (var i = 0; i < s.length; i++) {
						var r = s[i];
						secondGridStore.insert(secondGridStore.getCount(), r);
						secondGrid.getView().refresh();
						firstGridStore.remove(r);
						secondGrid.getSelectionModel().selectRow(secondGridStore.getCount());
						firstGrid.getSelectionModel().selectRow(0);
					}
				}
			}, {
				xtype: 'button',
				cls: 'ext-dd-arrow ext-dd-arrow-left',
				handler: function () {
					var firstGrid = component.getComponent(0), secondGrid = component.getComponent(2), firstGridStore = component.getComponent(0).store, secondGridStore = component.getComponent(2).store;
					var s = secondGrid.getSelectionModel().getSelections();
					for (var i = 0; i < s.length; i++) {
						var r = s[i];
						firstGridStore.insert(0, r);
						firstGrid.getView().refresh();
						secondGridStore.remove(r);
						firstGrid.getSelectionModel().selectRow(0);
						secondGrid.getSelectionModel().selectRow(0);
					}
				}
			}]
		}));
		
		// Right Grid
		if (rightGrid) {
						
			RightGridCmp = Ext.extend(Ext.grid.EditorGridPanel, {
				height: component.height,
				enableDragDrop: true,
				ddGroup: 'left-' + component.id + '-dd-group',
				sm: new Ext.grid.RowSelectionModel({}),
				listeners: {
					afterrender: function (g) {
																	
						var DropTarget, LeftDropTarget, RightDropTarget;
						
						DropTarget = new Ext.ux.dd.GridReorderDropTarget(g, {
							copy: false
						});
						Ext.dd.ScrollManager.register(g.getView().getEditorParent());
						
						var firstGrid = component.getComponent(0), secondGrid = component.getComponent(2), firstGridStore = component.getComponent(0).store, secondGridStore = component.getComponent(2).store;
									
						// Drag / Drop Between Grids
						LeftDropTarget = new Ext.dd.DropTarget(firstGrid.getView().scroller.dom, {
							ddGroup: 'left-' + component.id + '-dd-group',
							notifyDrop: function (ddSource, e, data) {
								var records = ddSource.dragData.selections;
								Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
								firstGrid.store.add(records);
								return true;
							}
						});
						RightDropTarget = new Ext.dd.DropTarget(secondGrid.getView().scroller.dom, {
							ddGroup: 'right-' + component.id + '-dd-group',
							notifyDrop: function (ddSource, e, data) {
								var records = ddSource.dragData.selections;
								Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
								secondGrid.store.add(records);
								return true;
							}
						});
						
						// Double Click Functionality for grid
						firstGrid.on('celldblclick', function (myGrid, rowIndex, columnIndex, e) {
							var s = firstGrid.getSelectionModel().getSelections();
							for (var i = 0; i < s.length; i++) {
								var r = s[i];
								secondGridStore.insert(0, r);
								secondGrid.getView().refresh();
								firstGridStore.remove(r);
								secondGrid.getSelectionModel().selectRow(0);
								firstGrid.getSelectionModel().selectRow(0);
							}
						});
						
						secondGrid.on('celldblclick', function (myGrid, rowIndex, columnIndex, e) {
							var s = secondGrid.getSelectionModel().getSelections();
							for (var i = 0; i < s.length; i++) {
								var r = s[i];
								firstGridStore.insert(0, r);
								firstGrid.getView().refresh();
								secondGridStore.remove(r);
								firstGrid.getSelectionModel().selectRow(0);
								secondGrid.getSelectionModel().selectRow(0);
							}
						});
					}
				}
			});
			component.add(new RightGridCmp(rightGrid));
		}
		else {
			throw ('Missing the rightGrid param in your Ext.DragDropGridPanels');
		}
		
	}
});