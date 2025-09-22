"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star, X, Check } from "lucide-react";
import { ParticipationEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createParticipation,
  updateParticipation,
} from "@/app/actions/participation";

type WidgetMode = "quick-set" | "display" | "edit";
type InternalState = "buttons" | "rating-form" | "editing";

interface ParticipationWidgetProps {
  sessionId: string;
  participation?: ParticipationEntry | null;
  mode: WidgetMode;
  onUpdate?: () => void;
}

export function ParticipationWidget({
  sessionId,
  participation,
  mode,
  onUpdate,
}: ParticipationWidgetProps) {
  const [internalState, setInternalState] = useState<InternalState>("buttons");
  const [selectedQuality, setSelectedQuality] = useState<number>(
    participation?.quality || 2
  );
  const [note, setNote] = useState(participation?.note || "");
  const [isPending, startTransition] = useTransition();

  // Reset form when participation changes
  const resetForm = () => {
    setSelectedQuality(participation?.quality || 2);
    setNote(participation?.note || "");
    setInternalState("buttons");
  };

  const handleParticipated = () => {
    console.log("handleParticipated");
    setInternalState("rating-form");
    console.log("setInternalState", internalState);
    setSelectedQuality(participation?.quality || 2);
    setNote(participation?.note || "");
  };

  const handleDidntParticipate = () => {
    startTransition(async () => {
      try {
        if (participation) {
          await updateParticipation(participation.id, false, 0);
        } else {
          await createParticipation(sessionId, false, 0);
        }
        resetForm();
        onUpdate?.();
      } catch (error) {
        console.error("Error updating participation:", error);
      }
    });
  };

  // const handleRemoveParticipation = () => {
  //   startTransition(async () => {
  //     try {
  //       if (participation) {
  //         await deleteParticipation(participation.id);
  //       }
  //       resetForm();
  //       onUpdate?.();
  //     } catch (error) {
  //       console.error("Error removing participation:", error);
  //     }
  //   });
  // };

  const handleSaveRating = () => {
    startTransition(async () => {
      try {
        if (participation) {
          await updateParticipation(
            participation.id,
            true,
            selectedQuality,
            note.trim() || undefined
          );
        } else {
          await createParticipation(
            sessionId,
            true,
            selectedQuality,
            note.trim() || undefined
          );
        }
        resetForm();
        onUpdate?.();
      } catch (error) {
        console.error("Error saving participation:", error);
      }
    });
  };

  const handleCancel = () => {
    resetForm();
  };

  const renderStars = (quality: number, interactive = false) => {
    return Array.from({ length: 3 }, (_, i) => {
      const starQuality = i + 1;
      return (
        <button
          key={i}
          onClick={() => interactive && setSelectedQuality(starQuality)}
          disabled={!interactive}
          className={cn(
            "transition-all duration-200",
            interactive && "hover:scale-110 active:scale-95"
          )}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-all duration-200",
              i < quality ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
              interactive && "cursor-pointer hover:text-yellow-300"
            )}
          />
        </button>
      );
    });
  };

  const qualityLabels = {
    1: "Basic",
    2: "Good",
    3: "Great",
  };

  // DISPLAY MODE: Show current participation status with edit option
  if (
    mode === "display" &&
    internalState !== "editing" &&
    internalState !== "rating-form"
  ) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          {participation ? (
            participation.participated ? (
              <>
                <span className="text-green-600 font-medium">
                  ✓ Participated
                </span>
                <span className="text-gray-500">•</span>
                <div className="flex gap-1">
                  {renderStars(participation.quality)}
                </div>
              </>
            ) : (
              <span className="text-gray-600 font-medium">
                ✗ Didn&apos;t participate
              </span>
            )
          ) : (
            <span className="text-gray-400 font-medium">
              — No participation recorded
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInternalState("editing")}
          className="h-8 px-2 text-sm"
          disabled={isPending}
        >
          Edit
        </Button>
      </div>
    );
  }

  // RATING FORM: Show star rating and notes input
  if (internalState === "rating-form") {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4">
        <div className="text-center">
          <h4 className="font-medium text-gray-900 mb-3">
            Rate Your Participation
          </h4>

          <div className="flex justify-center gap-2 mb-2">
            {renderStars(selectedQuality, true)}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {qualityLabels[selectedQuality as keyof typeof qualityLabels]}
          </p>

          <div className="mt-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about your participation (optional)..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 min-h-[44px]"
            disabled={isPending}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveRating}
            className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700"
            disabled={isPending}
          >
            <Check className="h-4 w-4 mr-1" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  // BUTTONS: Show participation action buttons based on mode
  const showRemoveOption = mode === "edit" || internalState === "editing";
  const buttonLayout = showRemoveOption ? "stacked" : "side-by-side";

  return (
    <div className="mt-4">
      <div
        className={cn(
          "gap-3",
          buttonLayout === "stacked" ? "flex flex-col" : "flex"
        )}
      >
        <Button
          onClick={handleParticipated}
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white min-h-[44px] font-medium transition-all duration-200 hover:scale-105 active:scale-95",
            buttonLayout === "stacked" ? "w-full" : "flex-1"
          )}
          disabled={isPending}
        >
          ✓ Participated
        </Button>

        <Button
          onClick={handleDidntParticipate}
          variant="outline"
          className={cn(
            "min-h-[44px] font-medium border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95",
            buttonLayout === "stacked" ? "w-full" : "flex-1"
          )}
          disabled={isPending}
        >
          ✗ Didn&apos;t Participate
        </Button>
      </div>

      {/* Cancel button for display mode editing */}
      {mode === "display" && internalState === "editing" && (
        <div className="mt-3">
          <Button
            variant="outline"
            onClick={() => setInternalState("buttons")}
            className="w-full min-h-[44px] font-medium"
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
