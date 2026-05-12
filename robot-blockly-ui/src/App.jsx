import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import "./App.css";



Blockly.Blocks["robot_start"] = {
  init: function () {
    this.appendDummyInput().appendField("START PROGRAM");

    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Start the robot program.");
  },
};

Blockly.Blocks["robot_distance_sensor"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("distance sensor");

    this.setOutput(true, "Number");

    this.setColour(20);

    this.setTooltip("Distance sensor reading.");
  },
};

Blockly.Blocks["robot_move_forward"] = {
  init: function () {
    this.appendValueInput("DISTANCE")
      .setCheck("Number")
      .appendField("move forward");

    this.appendDummyInput()
      .appendField("cm");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setColour(160);

    this.setTooltip("Move robot forward.");
  },
};

Blockly.Blocks["robot_move_backward"] = {
  init: function () {
    this.appendValueInput("DISTANCE")
      .setCheck("Number")
      .appendField("move backward");

    this.appendDummyInput()
      .appendField("cm");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setColour(160);

    this.setTooltip("Move robot backward.");
  },
};


Blockly.Blocks["robot_set_speed"] = {
  init: function () {
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("set speed");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setColour(160);

    this.setTooltip("Set robot movement speed.");
  },
};

Blockly.Blocks["robot_wait"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("wait")
      .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
      .appendField("seconds");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("Pause the robot for a given number of seconds.");
  },
};

Blockly.Blocks["robot_turn_right"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("turn right")
      .appendField(new Blockly.FieldNumber(90, 0, 360), "ANGLE")
      .appendField("degrees");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Turn the robot right by a given angle.");
  },
};

Blockly.Blocks["robot_turn_left"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("turn left")
      .appendField(new Blockly.FieldNumber(90, 0, 360), "ANGLE")
      .appendField("degrees");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Turn the robot left by a given angle.");
  },
};

Blockly.Blocks["robot_stop"] = {
  init: function () {
    this.appendDummyInput().appendField("stop robot");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("Stop the robot.");
  },
};

Blockly.Blocks["robot_speed_value"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("speed value");

    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("Numeric speed value.");
  },
};


function App() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [commandsOutput, setCommandsOutput] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");
  const [robotStatus, setRobotStatus] = useState("Idle");
    

  useEffect(() => {
    const toolbox = {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "Sensors",
          colour: "#FF9800",
          contents: [
            {
              kind: "block",
              type: "robot_distance_sensor",
            },
          ],
        },
        {
          kind: "category",
          name: "Motion",
          colour: "#4CAF50",
          contents: [
        {
          kind: "block",
          type: "robot_start",
        },
        {
          kind: "block",
          type: "robot_move_forward",
        },
        {
          kind: "block",
          type: "robot_move_backward",
        },
        {
          kind: "block",
          type: "robot_set_speed",
        },
        {
          kind: "block",
          type: "robot_turn_left",
        },
        {
          kind: "block",
          type: "robot_turn_right",
        },
        {
          kind: "block",
          type: "robot_stop",
        },
          ],
        },

        {
          kind: "category",
          name: "Timing",
          colour: "#FF9800",
          contents: [
            {
              kind: "block",
              type: "robot_wait",
            },
          ],
        },

        {
          kind: "category",
          name: "Logic",
          colour: "#9C27B0",
          contents: [
        {
          kind: "block",
          type: "controls_repeat_ext",
        },
        {
          kind: "block",
          type: "logic_compare",
        },
      ],
    },

    {
      kind: "category",
      name: "Math",
      colour: "#2196F3",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "robot_speed_value",
        },
      ],
    },
  ],
};

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
    });
    workspaceRef.current = workspace;

    const enforceSingleStartProgramBlock = (event) => {
      if (event.type !== Blockly.Events.BLOCK_CREATE) {
        return;
      }

      const startBlocks = workspace.getBlocksByType("robot_start", false);
      if (startBlocks.length <= 1) {
        return;
      }

      const createdStartBlock = event.ids
        ?.map((id) => workspace.getBlockById(id))
        .find((block) => block?.type === "robot_start");
      const duplicateBlock = createdStartBlock ?? startBlocks[startBlocks.length - 1];

      if (duplicateBlock) {
        Blockly.Events.disable();
        duplicateBlock.dispose(false);
        Blockly.Events.enable();
        setWarningMessage("Only one START PROGRAM block is allowed.");
      }
    };

    workspace.addChangeListener(enforceSingleStartProgramBlock);

    return () => {
      workspace.removeChangeListener(enforceSingleStartProgramBlock);
      workspace.dispose();
    };
  }, []);

  const buildCommands = () => {
    const topBlocks = workspaceRef.current.getTopBlocks(true);
    const commands = [];

    const readBlockChain = (block) => {
    let currentBlock = block;

    while (currentBlock) {
      if (currentBlock.type === "robot_move_forward") {
      const distanceBlock =
        currentBlock.getInputTargetBlock("DISTANCE");

      let distanceValue = 0;

      if (distanceBlock) {
        if (distanceBlock.type === "math_number") {
          distanceValue = Number(
            distanceBlock.getFieldValue("NUM")
          );
        }

        if (distanceBlock.type === "robot_distance_sensor") {
          distanceValue = "sensor_distance";
        }
      }

      commands.push({
        command: "move_forward",
        distance: distanceValue,
        unit: "cm",
      });
    } 

      if (currentBlock.type === "robot_move_backward") {
      const distanceBlock =
        currentBlock.getInputTargetBlock("DISTANCE");

      let distanceValue = 0;

      if (distanceBlock) {
        if (distanceBlock.type === "math_number") {
          distanceValue = Number(
          distanceBlock.getFieldValue("NUM")
        );
        }

        if (distanceBlock.type === "robot_distance_sensor") {
          distanceValue = "sensor_distance";
        }
      }

      commands.push({
        command: "move_backward",
        distance: distanceValue,
        unit: "cm",
      });
    }

      if (currentBlock.type === "robot_set_speed") {
        const speedBlock =
          currentBlock.getInputTargetBlock("SPEED");

        let speedValue = 0;

        if (speedBlock) {
          if (speedBlock.type === "math_number") {
            speedValue = Number(
            speedBlock.getFieldValue("NUM")
          );
          }

          if (speedBlock.type === "robot_speed_value") {
            speedValue = 75;
          }
        }

        commands.push({
          command: "set_speed",
          speed: speedValue,
          unit: "percent",
        });
      }

      if (currentBlock.type === "robot_turn_left") {
        commands.push({
          command: "turn_left",
          angle: Number(currentBlock.getFieldValue("ANGLE")),
          unit: "degrees",
        });
      }

      if (currentBlock.type === "robot_turn_right") {
        commands.push({
          command: "turn_right",
          angle: Number(currentBlock.getFieldValue("ANGLE")),
          unit: "degrees",
        });
      }

      if (currentBlock.type === "robot_wait") {
        commands.push({
          command: "wait",
          duration: Number(currentBlock.getFieldValue("SECONDS")),
          unit: "seconds",
        });
      }

      if (currentBlock.type === "robot_stop") {
        commands.push({
          command: "stop",
        });
      }

      currentBlock = currentBlock.getNextBlock();
    }
  };

  topBlocks.forEach(readBlockChain);
  return commands;
};

const getStartProgramBlocks = () => {
  return workspaceRef.current.getBlocksByType("robot_start", false);
};

const validateProgram = () => {
  const startBlocks = getStartProgramBlocks();

  if (startBlocks.length === 0) {
    setWarningMessage("Add a START PROGRAM block before generating commands.");
    setCommandsOutput([]);
    return false;
  }

  if (startBlocks.length > 1) {
    setWarningMessage("Only one START PROGRAM block is allowed.");
    setCommandsOutput([]);
    return false;
  }

  setWarningMessage("");
  return true;
};

const generateCommands = () => {
  if (!validateProgram()) {
    return;
  }

  const commands = buildCommands();
  setCommandsOutput(commands);
};

const runProgram = () => {
  if (!validateProgram()) {
    return;
  }

  const commands = buildCommands();
  setCommandsOutput(commands);
  setRobotStatus("Running");

  console.log("Sending commands to robot:", commands);
  // TODO: Send commands to robot via API or WebSocket
  // Example API call:
  // fetch('/api/robot/commands', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(commands)
  // })
  // For now, just show in console

  alert("Program sent to robot. Check console for now.");
};

const emergencyStop = () => {
  const command = {
    command: "emergency_stop",
  };

  setWarningMessage("Emergency stop command sent.");
  setCommandsOutput([command]);
  setRobotStatus("Stopped");
  console.log("Sending emergency stop to robot:", command);
  // TODO: Send emergency stop to robot via API or WebSocket
};

  return (
  <div className="robot-app">
    <div className="robot-toolbar">
      <div className="robot-toolbar__actions">
        <button className="touch-button touch-button--secondary" onClick={generateCommands}>
          Generate
        </button>
        <button className="touch-button touch-button--primary" onClick={runProgram}>
          Run Program
        </button>
      </div>

      <button
        className="touch-button touch-button--danger"
        onClick={emergencyStop}
      >
        Emergency Stop
      </button>

      <div className={`robot-status robot-status--${robotStatus.toLowerCase()}`} role="status">
        <span className="robot-status__label">Status:</span>
        <span className="robot-status__value">{robotStatus}</span>
      </div>

      <button
        className="touch-button touch-button--secondary"
        onClick={() => {
          workspaceRef.current.clear();
          setWarningMessage("");
          setCommandsOutput([]);
          setRobotStatus("Idle");
        }}
      >
        Clear
      </button>

      {warningMessage && (
        <span className="robot-warning" role="status">
          {warningMessage}
        </span>
      )}
    </div>

    <div className="robot-workspace">
      <div
        ref={blocklyDiv}
        className="robot-blockly"
      />

      <pre className="robot-output">
        {JSON.stringify(commandsOutput, null, 2)}
      </pre>
    </div>
  </div>
);
}

export default App;
