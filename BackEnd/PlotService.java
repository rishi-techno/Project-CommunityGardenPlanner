 @Service
public class PlotService {
    @Autowired
    private PlotRepository plotRepository;
    
    public List<Plot> getAllPlots() {
        return plotRepository.findAll();
    }
    
    public Plot savePlot(Plot plot) {
        return plotRepository.save(plot);
    }
}