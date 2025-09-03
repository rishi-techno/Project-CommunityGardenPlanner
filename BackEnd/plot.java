 @Entity
@Table(name = "plots")
public class Plot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String status;
    private String size;
    private String location;
    
    @OneToMany(mappedBy = "plot")
    private List<Planting> plantings;
    
    // Getters, setters, constructors
}
