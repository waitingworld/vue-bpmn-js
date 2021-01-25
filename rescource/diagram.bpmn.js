const bpmnJsXmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="8.0.1">
  <process id="Process_1" isExecutable="false">
    <startEvent id="Event_1cown60">
      <outgoing>Flow_1cmacz2</outgoing>
    </startEvent>
    <sequenceFlow id="Flow_1cmacz2" sourceRef="Event_1cown60" targetRef="Activity_1vid5kz" />
    <userTask id="Activity_1vid5kz">
      <incoming>Flow_1cmacz2</incoming>
      <outgoing>Flow_06lk7i2</outgoing>
    </userTask>
    <endEvent id="Event_1ghs8tj">
      <incoming>Flow_06lk7i2</incoming>
    </endEvent>
    <sequenceFlow id="Flow_06lk7i2" sourceRef="Activity_1vid5kz" targetRef="Event_1ghs8tj" />
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_1cmacz2_di" bpmnElement="Flow_1cmacz2">
        <omgdi:waypoint x="188" y="300" />
        <omgdi:waypoint x="250" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06lk7i2_di" bpmnElement="Flow_06lk7i2">
        <omgdi:waypoint x="350" y="300" />
        <omgdi:waypoint x="412" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1cown60_di" bpmnElement="Event_1cown60">
        <omgdc:Bounds x="152" y="282" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0e3d9lu_di" bpmnElement="Activity_1vid5kz">
        <omgdc:Bounds x="250" y="260" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1ghs8tj_di" bpmnElement="Event_1ghs8tj">
        <omgdc:Bounds x="412" y="282" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`
export default bpmnJsXmlStr