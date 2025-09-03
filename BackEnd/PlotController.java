 @Controller
@RequestMapping("/plots")
public class PlotController {
    @Autowired
    private PlotService plotService;
    
    @GetMapping
    public String listPlots(Model model) {
        model.addAttribute("plots", plotService.getAllPlots());
        return "plots/list";
    }
    
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("plot", new Plot());
        return "plots/create";
    }
    
    @PostMapping("/save")
    public String savePlot(@ModelAttribute Plot plot) {
        plotService.savePlot(plot);
        return "redirect:/plots";
    }
}
