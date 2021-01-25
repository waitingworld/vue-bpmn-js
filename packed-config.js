/**
 * A rule that checks that sequence flows outgoing from a
 * conditional forking gateway or activity are
 * either default flows _or_ have a condition attached
 */
var conditionalFlows = function () {
    function check(node, reporter) {

        if (!isConditionalForking(node)) {
            return;
        }

        const outgoing = node.outgoing || [];

        outgoing.forEach((flow) => {
            const missingCondition = (
                !hasCondition(flow) &&
                !isDefaultFlow(node, flow)
            );

            if (missingCondition) {
                reporter.report(flow.id, '跳转分支缺少条件');
            }
        });
    }

    return {
        check
    };

};


// helpers /////////////////////////////

function isConditionalForking(node) {

    const defaultFlow = node['default'];
    const outgoing = node.outgoing || [];

    return defaultFlow || outgoing.find(hasCondition);
}

function hasCondition(flow) {
    return !!flow.conditionExpression;
}

function isDefaultFlow(node, flow) {
    return node['default'] === flow;
}

/**
 * Checks whether node is of specific bpmn type.
 *
 * @param {ModdleElement} node
 * @param {String} type
 *
 * @return {Boolean}
 */
function is(node, type) {

    if (type.indexOf(':') === -1) {
        type = 'bpmn:' + type;
    }

    return (
        (typeof node.$instanceOf === 'function')
            ? node.$instanceOf(type)
            : node.$type === type
    );
}

/**
 * Checks whether node has any of the specified types.
 *
 * @param {ModdleElement} node
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
function isAny(node, types) {
    return types.some(function (type) {
        return is(node, type);
    });
}

var index_esm = /*#__PURE__*/Object.freeze({
    __proto__: null,
    is: is,
    isAny: isAny
});

const {
    is: is$1,
    isAny: isAny$1
} = index_esm;


/**
 * A rule that checks the presence of an end event per scope.
 */
var endEventRequired = function () {

    function hasEndEvent(node) {
        const flowElements = node.flowElements || [];

        return (
            flowElements.some(node => is$1(node, 'bpmn:EndEvent'))
        );
    }

    function check(node, reporter) {

        if (!isAny$1(node, [
            'bpmn:Process',
            'bpmn:SubProcess'
        ])) {
            return;
        }

        if (!hasEndEvent(node)) {
            const type = is$1(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

            reporter.report(node.id, type + ' 缺少结束事件');
        }
    }

    return {check};
};

const {
    is: is$2
} = index_esm;

/**
 * A rule that checks that start events inside an event sub-process
 * are typed.
 */
var eventSubProcessTypedStartEvent = function () {

    function check(node, reporter) {

        if (!is$2(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
            return;
        }

        const flowElements = node.flowElements || [];

        flowElements.forEach(function (flowElement) {

            if (!is$2(flowElement, 'bpmn:StartEvent')) {
                return false;
            }

            const eventDefinitions = flowElement.eventDefinitions || [];

            if (eventDefinitions.length === 0) {
                reporter.report(flowElement.id, '开始事件缺少事件定义');
            }
        });
    }

    return {
        check
    };

};

const {
    isAny: isAny$2
} = index_esm;

/**
 通过尝试赋予任务或事件联接语义来建模检查没有伪联接的规则。
 用户应为并行加入网关建模以实现所需的行为。
 */
var fakeJoin = function () {

    function check(node, reporter) {

        if (!isAny$2(node, [
            'bpmn:Task',
            'bpmn:Event'
        ])) {
            return;
        }

        const incoming = node.incoming || [];

        if (incoming.length > 1) {
            reporter.report(node.id, 'Incoming flows do not join');
        }
    }

    return {
        check
    };

};

const {
    is: is$3
} = index_esm;

/**
 * Create a checker that disallows the given element type.
 *
 * @param {String} type
 *
 * @return {Function} ruleImpl
 */
function disallowNodeType(type) {

    return function () {

        function check(node, reporter) {

            if (is$3(node, type)) {
                reporter.report(node.id, '元素类型 <' + type + '> 不允许被创建');
            }
        }

        return {
            check
        };

    };

}

var disallowNodeType_1 = disallowNodeType;

var helper = {
    disallowNodeType: disallowNodeType_1
};

const disallowNodeType$1 = helper.disallowNodeType;

var noComplexGateway = disallowNodeType$1('bpmn:ComplexGateway');

const {
    isAny: isAny$3
} = index_esm;


/**
 * A rule that verifies that there exists no disconnected
 * flow elements, i.e. elements without incoming
 * _or_ outgoing sequence flows
 */
var noDisconnected = function () {

    function check(node, reporter) {

        if (!isAny$3(node, [
            'bpmn:Task',
            'bpmn:Gateway',
            'bpmn:SubProcess',
            'bpmn:Event'
        ]) || node.triggeredByEvent) {
            return;
        }

        const incoming = node.incoming || [];
        const outgoing = node.outgoing || [];

        if (!incoming.length && !outgoing.length) {
            reporter.report(node.id, '元素未连接');
        }
    }

    return {
        check
    };

};

const {
    is: is$4
} = index_esm;

/**
 * A rule that verifies that there are no disconnected
 * flow elements, i.e. elements without incoming
 * _or_ outgoing sequence flows
 */
var noDuplicateSequenceFlows = function () {

    const keyed = {};

    const outgoingReported = {};
    const incomingReported = {};

    function check(node, reporter) {

        if (!is$4(node, 'bpmn:SequenceFlow')) {
            return;
        }

        const key = flowKey(node);

        if (key in keyed) {
            reporter.report(node.id, '连线重复');

            const sourceId = node.sourceRef.id;
            const targetId = node.targetRef.id;

            if (!outgoingReported[sourceId]) {
                reporter.report(sourceId, '重复的出路连线');

                outgoingReported[sourceId] = true;
            }

            if (!incomingReported[targetId]) {
                reporter.report(targetId, '重复的入路连线');

                incomingReported[targetId] = true;
            }
        } else {
            keyed[key] = node;
        }
    }

    return {
        check
    };

};


// helpers /////////////////

function flowKey(flow) {
    const conditionExpression = flow.conditionExpression;

    const condition = conditionExpression ? conditionExpression.body : '';
    const source = flow.sourceRef ? flow.sourceRef.id : flow.id;
    const target = flow.targetRef ? flow.targetRef.id : flow.id;

    return source + '#' + target + '#' + condition;
}

const {
    is: is$5
} = index_esm;


/**
 * A rule that checks, whether a gateway forks and joins
 * at the same time.
 */
var noGatewayJoinFork = function () {

    function check(node, reporter) {

        if (!is$5(node, 'bpmn:Gateway')) {
            return;
        }

        const incoming = node.incoming || [];
        const outgoing = node.outgoing || [];

        if (incoming.length > 1 && outgoing.length > 1) {
            reporter.report(node.id, '网关分叉和加入');
        }
    }

    return {
        check
    };

};

const {
    isAny: isAny$4
} = index_esm;


/**
 * A rule that checks that no implicit split is modeled
 * starting from a task.
 *
 * users should model the parallel splitting gateway
 * explicitly instead.
 */
var noImplicitSplit = function () {

    function check(node, reporter) {

        if (!isAny$4(node, [
            'bpmn:Task',
            'bpmn:Event'
        ])) {
            return;
        }

        const outgoing = node.outgoing || [];

        const outgoingWithoutCondition = outgoing.filter((flow) => {
            return !hasCondition$1(flow) && !isDefaultFlow$1(node, flow);
        });

        if (outgoingWithoutCondition.length > 1) {
            reporter.report(node.id, 'Flow 隐式拆分');
        }
    }

    return {
        check
    };

};


// helpers /////////////////////////////

function hasCondition$1(flow) {
    return !!flow.conditionExpression;
}

function isDefaultFlow$1(node, flow) {
    return node['default'] === flow;
}

const disallowNodeType$2 = helper.disallowNodeType;

var noInclusiveGateway = disallowNodeType$2('bpmn:InclusiveGateway');

const {
    is: is$6
} = index_esm;

/**
 * A rule that checks whether not more than one blank start event
 * exists per scope.
 */
var singleBlankStartEvent = function () {

    function check(node, reporter) {

        if (!is$6(node, 'bpmn:FlowElementsContainer')) {
            return;
        }

        const flowElements = node.flowElements || [];

        const blankStartEvents = flowElements.filter(function (flowElement) {

            if (!is$6(flowElement, 'bpmn:StartEvent')) {
                return false;
            }

            const eventDefinitions = flowElement.eventDefinitions || [];

            return eventDefinitions.length === 0;
        });

        if (blankStartEvents.length > 1) {
            const type = is$6(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

            reporter.report(node.id, type + ' 有多个空白开始事件');
        }
    }

    return {
        check
    };

};

const {
    is: is$7
} = index_esm;


/**
 * A rule that verifies that an event contains maximum one event definition.
 */
var singleEventDefinition = function () {

    function check(node, reporter) {

        if (!is$7(node, 'bpmn:Event')) {
            return;
        }

        const eventDefinitions = node.eventDefinitions || [];

        if (eventDefinitions.length > 1) {
            reporter.report(node.id, '事件具有多个事件定义');
        }
    }

    return {
        check
    };

};

const {
    is: is$8,
    isAny: isAny$5
} = index_esm;


/**
 * A rule that checks for the presence of a start event per scope.
 */
var startEventRequired = function () {

    function hasStartEvent(node) {
        const flowElements = node.flowElements || [];

        return (
            flowElements.some(node => is$8(node, 'bpmn:StartEvent'))
        );
    }

    function check(node, reporter) {

        if (!isAny$5(node, [
            'bpmn:Process',
            'bpmn:SubProcess'
        ])) {
            return;
        }

        if (!hasStartEvent(node)) {
            const type = is$8(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

            reporter.report(node.id, type + ' 缺少开始事件');
        }
    }

    return {check};
};

const {
    is: is$9
} = index_esm;


/**
 * A rule that checks that start events inside a normal sub-processes
 * are blank (do not have an event definition).
 */
var subProcessBlankStartEvent = function () {

    function check(node, reporter) {

        if (!is$9(node, 'bpmn:SubProcess') || node.triggeredByEvent) {
            return;
        }

        const flowElements = node.flowElements || [];

        flowElements.forEach(function (flowElement) {

            if (!is$9(flowElement, 'bpmn:StartEvent')) {
                return false;
            }

            const eventDefinitions = flowElement.eventDefinitions || [];

            if (eventDefinitions.length > 0) {
                reporter.report(flowElement.id, '开始事件必须为空');
            }
        });
    }

    return {
        check
    };

};

const {
    is: is$a
} = index_esm;

/**
 * A rule that checks, whether a gateway has only one source and target.
 *
 * Those gateways are superfluous since they don't do anything.
 */
var superfluousGateway = function () {

    function check(node, reporter) {

        if (!is$a(node, 'bpmn:Gateway')) {
            return;
        }

        const incoming = node.incoming || [];
        const outgoing = node.outgoing || [];

        if (incoming.length === 1 && outgoing.length === 1) {
            reporter.report(node.id, '网关是多余的。 它只有一个来源和目标.');
        }
    }

    return {
        check
    };

};

const cache = {};

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 *
 * @param {Object} cache
 */
function Resolver() {
}

Resolver.prototype.resolveRule = function (pkg, ruleName) {

    const rule = cache[pkg + '/' + ruleName];

    if (!rule) {
        throw new Error('无法解析的规则 <' + pkg + '/' + ruleName + '>');
    }

    return rule;
};

Resolver.prototype.resolveConfig = function (pkg, configName) {
    throw new Error(
        '无法解析的属性 <' + configName + '> in <' + pkg + '>'
    );
};

const resolver = new Resolver();

const rules = {
    "conditional-flows": "error",
    "end-event-required": "error",
    "event-sub-process-typed-start-event": "error",
    "fake-join": "warn",
    "no-complex-gateway": "error",
    "no-disconnected": "error",
    "no-duplicate-sequence-flows": "error",
    "no-gateway-join-fork": "error",
    "no-implicit-split": "error",
    "no-inclusive-gateway": "error",
    "single-blank-start-event": "error",
    "single-event-definition": "error",
    "start-event-required": "error",
    "sub-process-blank-start-event": "error",
    "superfluous-gateway": "warning"
};

const config = {
    rules: rules
};

const bundle = {
    resolver: resolver,
    config: config
};
cache['bpmnlint/conditional-flows'] = conditionalFlows;
cache['bpmnlint/end-event-required'] = endEventRequired;
cache['bpmnlint/event-sub-process-typed-start-event'] = eventSubProcessTypedStartEvent;
cache['bpmnlint/fake-join'] = fakeJoin;
cache['bpmnlint/no-complex-gateway'] = noComplexGateway;
cache['bpmnlint/no-disconnected'] = noDisconnected;
cache['bpmnlint/no-duplicate-sequence-flows'] = noDuplicateSequenceFlows;
cache['bpmnlint/no-gateway-join-fork'] = noGatewayJoinFork;
cache['bpmnlint/no-implicit-split'] = noImplicitSplit;
cache['bpmnlint/no-inclusive-gateway'] = noInclusiveGateway;
cache['bpmnlint/single-blank-start-event'] = singleBlankStartEvent;
cache['bpmnlint/single-event-definition'] = singleEventDefinition;
cache['bpmnlint/start-event-required'] = startEventRequired;
cache['bpmnlint/sub-process-blank-start-event'] = subProcessBlankStartEvent;
cache['bpmnlint/superfluous-gateway'] = superfluousGateway;

export default bundle;
export {config, resolver};
