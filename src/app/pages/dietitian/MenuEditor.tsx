import { useState } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Save, Send, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function MenuEditor() {
  const { userId } = useParams();
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("2026-03");
  const [mealData, setMealData] = useState({
    BREAKFAST: { description: "", calories: "", protein: "", carbs: "", fats: "" },
    LUNCH: { description: "", calories: "", protein: "", carbs: "", fats: "" },
    DINNER: { description: "", calories: "", protein: "", carbs: "", fats: "" },
    SNACK: { description: "", calories: "", protein: "", carbs: "", fats: "" },
  });

  const handleSaveDraft = () => {
    toast.success("Draft saved");
  };

  const handleSubmitBatch = () => {
    toast.success("Menu submitted to patient for approval");
  };

  const handleDeleteDay = () => {
    toast.success("Day content deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Menu Editor</h1>
          <p className="text-muted-foreground mt-1">
            Create monthly menu for {userId ? `Patient #${userId}` : "selected patient"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="size-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmitBatch}>
            <Send className="size-4 mr-2" />
            Submit Menu
          </Button>
        </div>
      </div>

      <Card className="bg-warning-light border-warning">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Rejection Feedback</p>
              <p className="text-sm text-muted-foreground mt-1">
                Patient requested more variety in breakfast options and reduced sodium content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Month & Days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026-03">March 2026</SelectItem>
                  <SelectItem value="2026-04">April 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDay === day
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  Day {day}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Day {selectedDay} - Meals</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleDeleteDay}>
                <Trash2 className="size-4 mr-2" />
                Delete Day
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="BREAKFAST">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="BREAKFAST">Breakfast</TabsTrigger>
                <TabsTrigger value="LUNCH">Lunch</TabsTrigger>
                <TabsTrigger value="DINNER">Dinner</TabsTrigger>
                <TabsTrigger value="SNACK">Snack</TabsTrigger>
              </TabsList>

              {Object.entries(mealData).map(([mealType, data]) => (
                <TabsContent key={mealType} value={mealType} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Description (required, min 5 characters)</Label>
                    <Textarea
                      placeholder="Enter meal description..."
                      value={data.description}
                      onChange={(e) =>
                        setMealData({
                          ...mealData,
                          [mealType]: { ...data, description: e.target.value },
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Calories (optional)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.calories}
                        onChange={(e) =>
                          setMealData({
                            ...mealData,
                            [mealType]: { ...data, calories: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Protein (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.protein}
                        onChange={(e) =>
                          setMealData({
                            ...mealData,
                            [mealType]: { ...data, protein: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Carbs (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.carbs}
                        onChange={(e) =>
                          setMealData({
                            ...mealData,
                            [mealType]: { ...data, carbs: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fats (g)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.fats}
                        onChange={(e) =>
                          setMealData({
                            ...mealData,
                            [mealType]: { ...data, fats: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
