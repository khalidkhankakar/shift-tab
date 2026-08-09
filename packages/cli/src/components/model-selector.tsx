import { useKeyboard } from "@opentui/react";

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    description: "Fast & smart — best for everyday use",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    description: "Most capable — slower, great for complex tasks",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    description: "Fastest & cheapest — ideal for quick responses",
  },
];

interface ModelSelectorProps {
  currentModel: string;
  onSelect: (modelId: string) => void;
  onClose: () => void;
}

/**
 * Full-screen absolute overlay for selecting an AI model.
 * Closes on Escape without changing the model.
 * Confirms with Enter/Return via <select>'s onSelect.
 */
const ModelSelector = ({ currentModel, onSelect, onClose }: ModelSelectorProps) => {
  // Close on Escape
  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose();
    }
  });

  const currentIndex = AVAILABLE_MODELS.findIndex((m) => m.id === currentModel);
  const selectedIndex = currentIndex >= 0 ? currentIndex : 0;

  const options = AVAILABLE_MODELS.map((m) => ({
    name: m.name,
    description: m.description,
    value: m.id,
  }));

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      backgroundColor="#00000099"
      zIndex={20}
      justifyContent="center"
      alignItems="center"
    >
      {/* Modal card */}
      <box
        width={60}
        borderStyle="rounded"
        borderColor="#7dd3fc"
        backgroundColor="#0b0c1b"
        padding={1}
        flexDirection="column"
        gap={1}
        title=" Select Model "
        titleColor="#7dd3fc"
      >
        <text fg="#94a3b8" marginBottom={1}>
          Use ↑↓ to navigate · Enter to confirm · Esc to cancel
        </text>
        <select
          height={AVAILABLE_MODELS.length * 3}
          options={options}
          selectedIndex={selectedIndex}
          focused={true}
          wrapSelection={true}
          showDescription={true}
          showSelectionIndicator={true}
          backgroundColor="#0b0c1b"
          textColor="#e2e8f0"
          focusedBackgroundColor="#1e293b"
          focusedTextColor="#7dd3fc"
          selectedBackgroundColor="#1e3a5f"
          selectedTextColor="#bae6fd"
          descriptionColor="#64748b"
          selectedDescriptionColor="#93c5fd"
          itemSpacing={1}
          onSelect={(_idx, option) => {
            if (option) {
              onSelect(option.value as string);
              onClose();
            }
          }}
        />
      </box>
    </box>
  );
};

export default ModelSelector;